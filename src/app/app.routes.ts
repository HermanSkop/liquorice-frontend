import { Routes } from '@angular/router';
import {CatalogComponent} from './views/catalog/catalog.component';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
