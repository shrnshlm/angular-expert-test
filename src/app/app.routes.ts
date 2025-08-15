import { Routes } from '@angular/router';
import { UsersTableComponent } from './users-table/users-table';
import { TodosByUserComponent } from './todos-by-user/todos-by-user';
import { CurrencyExchangeComponent } from './currency-exchange/currency-exchange';
import { ResponsivePageComponent } from './responsive-page/responsive-page';

export const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UsersTableComponent },
  { path: 'todos', component: TodosByUserComponent },
  { path: 'currency', component: CurrencyExchangeComponent },
  { path: 'responsive', component: ResponsivePageComponent },
];
