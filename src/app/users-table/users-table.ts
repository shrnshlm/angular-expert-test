import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services';
import type { User } from '../services';
import { UserTodosModalComponent } from '../modal/user-todos-modal/user-todos-modal';

@Component({
  selector: 'app-users-table',
  imports: [CommonModule, UserTodosModalComponent],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableComponent implements OnInit {
  private userService = inject(UserService);
  
  users = signal<User[]>([]);
  loading = signal(true);
  selectedUser = signal<User | null>(null);
  showModal = signal(false);

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  openUserTodos(user: User, event: Event) {
    event.preventDefault();
    this.selectedUser.set(user);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedUser.set(null);
  }
}
