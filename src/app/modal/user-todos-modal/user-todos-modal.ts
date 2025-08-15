import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, signal, effect, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services';
import type { User, Todo } from '../../services';

@Component({
  selector: 'app-user-todos-modal',
  imports: [CommonModule],
  templateUrl: './user-todos-modal.html',
  styleUrl: './user-todos-modal.scss'
})
export class UserTodosModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
  @ViewChild('modalContent') modalContent!: ElementRef;
  @ViewChild('closeButton') closeButton!: ElementRef;
  
  private userService = inject(UserService);
  private previouslyFocusedElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex = 0;
  
  todos = signal<Todo[]>([]);
  loading = signal(true);
  
  constructor() {
    // Reactive focus management using signals
    effect(() => {
      const todosList = this.todos();
      const isLoading = this.loading();
      
      // Update focusable elements when todos change or loading completes
      if (!isLoading && this.modalContent?.nativeElement) {
        // Use queueMicrotask to ensure DOM has been updated
        queueMicrotask(() => {
          this.updateFocusableElements();
        });
      }
    });
  }

  ngOnInit() {
    // Store the previously focused element to restore later
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    this.userService.getUserTodos(this.user.id).subscribe({
      next: (todos: Todo[]) => {
        this.todos.set(todos);
        this.loading.set(false);
        // The effect() will automatically handle focus updates
      },
      error: () => {
        this.loading.set(false);
        // The effect() will still run and update focus elements
      }
    });
  }

  ngAfterViewInit() {
    // Focus the modal content container
    this.modalContent.nativeElement.focus();
    
    // Initial update of focusable elements (effect will handle subsequent updates)
    this.updateFocusableElements();
  }

  ngOnDestroy() {
    // Restore background scrolling
    document.body.style.overflow = '';
    
    // Restore focus to previously focused element
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  private updateFocusableElements() {
    if (!this.modalContent?.nativeElement) {
      return;
    }

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    this.focusableElements = Array.from(
      this.modalContent.nativeElement.querySelectorAll(focusableSelectors)
    );
    
    
    // Find the currently focused element index
    const activeElement = document.activeElement as HTMLElement;
    this.currentFocusIndex = this.focusableElements.indexOf(activeElement);
    if (this.currentFocusIndex === -1) {
      this.currentFocusIndex = 0;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close.emit();
        break;
        
      case 'Tab':
        this.handleTabNavigation(event);
        break;
    }
  }

  private handleTabNavigation(event: KeyboardEvent) {
    if (this.focusableElements.length === 0) return;
    
    event.preventDefault();
    
    if (event.shiftKey) {
      // Shift + Tab (backward)
      this.currentFocusIndex = this.currentFocusIndex <= 0 
        ? this.focusableElements.length - 1 
        : this.currentFocusIndex - 1;
    } else {
      // Tab (forward)
      this.currentFocusIndex = this.currentFocusIndex >= this.focusableElements.length - 1 
        ? 0 
        : this.currentFocusIndex + 1;
    }
    
    this.focusableElements[this.currentFocusIndex]?.focus();
  }

  private handleArrowNavigation(event: KeyboardEvent) {
    if (this.focusableElements.length === 0) return;
    
    event.preventDefault();
    
    if (event.key === 'ArrowDown') {
      this.currentFocusIndex = this.currentFocusIndex >= this.focusableElements.length - 1 
        ? 0 
        : this.currentFocusIndex + 1;
    } else {
      this.currentFocusIndex = this.currentFocusIndex <= 0 
        ? this.focusableElements.length - 1 
        : this.currentFocusIndex - 1;
    }
    
    this.focusableElements[this.currentFocusIndex]?.focus();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onClose() {
    this.close.emit();
  }

  onTodoKeyDown(event: KeyboardEvent, todo: Todo) {
    // Handle Enter or Space on todo items
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // For now, just announce the todo details
      this.announceTodoDetails(todo);
    }
  }

  private announceTodoDetails(todo: Todo) {
    // Create a temporary element for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Todo: ${todo.title}. Status: ${todo.completed ? 'Completed' : 'Pending'}`;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement element after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}
