import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Todo } from '../../services';

export type TodosDisplayMode = 'list' | 'grid';

@Component({
  selector: 'app-todos-list',
  imports: [CommonModule],
  templateUrl: './todos-list.html',
  styleUrl: './todos-list.scss'
})
export class TodosListComponent {
  @Input() todos = signal<Todo[]>([]);
  @Input() loading = signal(true); // Start with loading true to prevent flash
  @Input() error = signal<string | null>(null);
  @Input() displayMode = signal<TodosDisplayMode>('list');
  @Input() showStats = signal(true);
  @Input() showTodoId = signal(false);
  @Input() emptyMessage = signal<string>('');
  @Input() ariaLabel = signal<string>('Todo items');
  
  constructor() {
    // Component initialization
  }
  
  @Output() todoClick = new EventEmitter<Todo>();
  @Output() todoKeyDown = new EventEmitter<{event: KeyboardEvent, todo: Todo}>();

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }

  getCompletedCount(): number {
    return this.todos().filter(t => t.completed).length;
  }

  getPendingCount(): number {
    return this.todos().filter(t => !t.completed).length;
  }

  onTodoClick(todo: Todo) {
    this.todoClick.emit(todo);
  }

  onTodoKeyDown(event: KeyboardEvent, todo: Todo) {
    this.todoKeyDown.emit({ event, todo });
  }
}