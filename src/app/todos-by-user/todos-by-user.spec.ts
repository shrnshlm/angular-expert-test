import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosByUser } from './todos-by-user';

describe('TodosByUser', () => {
  let component: TodosByUser;
  let fixture: ComponentFixture<TodosByUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosByUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodosByUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
