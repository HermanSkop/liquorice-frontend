import { Routes } from '@angular/router';
import {CatalogComponent} from './views/catalog/catalog.component';
import {AuthenticatorComponent} from './views/authenticator/authenticator.component';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'login', component: AuthenticatorComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
