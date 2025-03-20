import { Routes } from '@angular/router';
import {CatalogComponent} from './views/catalog/catalog.component';
import {AuthenticatorComponent} from './views/authenticator/authenticator.component';
import {CartComponent} from './views/cart/cart.component';
import {AuthGuard} from './auth.guard';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AuthenticatorComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
