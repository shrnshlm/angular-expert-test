import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services';
import { TodosListComponent } from '../shared/todos-list/todos-list';
import type { Todo } from '../services';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-todos-by-user',
  imports: [CommonModule, FormsModule, TodosListComponent],
  templateUrl: './todos-by-user.html',
  styleUrl: './todos-by-user.scss'
})
export class TodosByUserComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private userIdSubject = new Subject<string>();

  userId = signal<string>('');
  todos = signal<Todo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  validationError = signal<string | null>(null);
  
  // Helper methods for template
  protected readonly signal = signal;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'] || '';
      this.userId.set(userId);
      if (userId && this.isValidUserId(userId)) {
        this.loadTodos(parseInt(userId));
      }
    });

    this.userIdSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      switchMap(userId => {
        this.error.set(null);
        this.validationError.set(null);
        
        if (!userId.trim()) {
          this.todos.set([]);
          return of(null);
        }

        if (!this.isValidUserId(userId)) {
          this.validationError.set('User ID must be a number between 1 and 10');
          this.todos.set([]);
          return of(null);
        }

        this.loading.set(true);
        return this.userService.getUserTodos(parseInt(userId));
      })
    ).subscribe({
      next: (todos) => {
        if (todos) {
          this.todos.set(todos);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load todos');
        this.loading.set(false);
        this.todos.set([]);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUserIdChange(value: string) {
    this.userId.set(value);
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: value.trim() ? { userId: value.trim() } : {},
      queryParamsHandling: 'merge'
    });
    
    this.userIdSubject.next(value);
  }

  private isValidUserId(userId: string): boolean {
    const num = parseInt(userId);
    return !isNaN(num) && num >= 1 && num <= 10;
  }

  private loadTodos(userId: number) {
    this.loading.set(true);
    this.error.set(null); // Clear any previous error
    this.userService.getUserTodos(userId).subscribe({
      next: (todos: Todo[]) => {
        this.error.set(null); // Clear error on success
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load todos');
        this.loading.set(false);
        this.todos.set([]);
      }
    });
  }

}
