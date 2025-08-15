import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private todosCache = new Map<number, Todo[]>();
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }
  
  getUserTodos(userId: number): Observable<Todo[]> {
    if (this.todosCache.has(userId)) {
      return new Observable(observer => {
        observer.next(this.todosCache.get(userId)!);
        observer.complete();
      });
    }
    
    return this.http.get<Todo[]>(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
      .pipe(
        map(todos => {
          this.todosCache.set(userId, todos);
          return todos;
        })
      );
  }
}
