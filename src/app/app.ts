import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorService } from './services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'angular-expert-test';
  private errorService = inject(ErrorService);
  
  // Signal for navbar collapse state
  navbarCollapsed = signal(true);
  
  get errorMessage() {
    return this.errorService.currentError();
  }
  
  toggleNavbar() {
    this.navbarCollapsed.set(!this.navbarCollapsed());
  }
  
  closeNavbar() {
    this.navbarCollapsed.set(true);
  }
}
