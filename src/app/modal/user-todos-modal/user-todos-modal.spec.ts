import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTodosModal } from './user-todos-modal';

describe('UserTodosModal', () => {
  let component: UserTodosModal;
  let fixture: ComponentFixture<UserTodosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTodosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTodosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
