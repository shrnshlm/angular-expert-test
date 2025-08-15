import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TodosListComponent } from './todos-list';
import type { Todo } from '../../services';

describe('TodosListComponent', () => {
  let component: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  const mockTodos: Todo[] = [
    { id: 1, userId: 1, title: 'Test todo 1', completed: false },
    { id: 2, userId: 1, title: 'Test todo 2', completed: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodosListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading spinner when loading is true', () => {
    component.loading.set(true);
    fixture.detectChanges();

    const loadingElement = fixture.nativeElement.querySelector('.spinner-border');
    expect(loadingElement).toBeTruthy();
  });

  it('should display error message when error is present', () => {
    component.error.set('Test error message');
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.alert-danger');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent.trim()).toBe('Test error message');
  });

  it('should display todos in list mode', () => {
    component.todos.set(mockTodos);
    component.displayMode.set('list');
    fixture.detectChanges();

    const todoItems = fixture.nativeElement.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(2);
  });

  it('should display todos in grid mode', () => {
    component.todos.set(mockTodos);
    component.displayMode.set('grid');
    fixture.detectChanges();

    const todoCards = fixture.nativeElement.querySelectorAll('.card');
    expect(todoCards.length).toBe(2);
  });

  it('should show stats when showStats is true', () => {
    component.todos.set(mockTodos);
    component.showStats.set(true);
    fixture.detectChanges();

    const statsElement = fixture.nativeElement.querySelector('.mt-3');
    expect(statsElement).toBeTruthy();
    expect(statsElement.textContent).toContain('Total todos: 2');
    expect(statsElement.textContent).toContain('Completed: 1');
    expect(statsElement.textContent).toContain('Pending: 1');
  });

  it('should hide stats when showStats is false', () => {
    component.todos.set(mockTodos);
    component.showStats.set(false);
    fixture.detectChanges();

    const statsElement = fixture.nativeElement.querySelector('.mt-3');
    expect(statsElement).toBeFalsy();
  });

  it('should display empty message when no todos', () => {
    component.todos.set([]);
    component.emptyMessage.set('No todos available');
    fixture.detectChanges();

    const emptyElement = fixture.nativeElement.querySelector('.text-center.text-muted');
    expect(emptyElement).toBeTruthy();
    expect(emptyElement.textContent.trim()).toBe('No todos available');
  });

  it('should emit todoClick when todo is clicked', () => {
    spyOn(component.todoClick, 'emit');
    component.todos.set(mockTodos);
    component.displayMode.set('list');
    fixture.detectChanges();

    const firstTodoItem = fixture.nativeElement.querySelector('.todo-item');
    firstTodoItem.click();

    expect(component.todoClick.emit).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('should calculate completed count correctly', () => {
    component.todos.set(mockTodos);
    expect(component.getCompletedCount()).toBe(1);
  });

  it('should calculate pending count correctly', () => {
    component.todos.set(mockTodos);
    expect(component.getPendingCount()).toBe(1);
  });

  it('should track todos by id', () => {
    const todo = mockTodos[0];
    const result = component.trackByTodoId(0, todo);
    expect(result).toBe(todo.id);
  });
});