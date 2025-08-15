import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private error = signal<string | null>(null);

  currentError = this.error.asReadonly();

  setError(message: string) {
    this.error.set(message);
    setTimeout(() => this.clearError(), 5000);
  }

  clearError() {
    this.error.set(null);
  }
}
