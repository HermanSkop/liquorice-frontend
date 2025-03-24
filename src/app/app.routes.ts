import { Routes } from '@angular/router';
import {CatalogComponent} from './views/catalog/catalog.component';
import {AuthenticatorComponent} from './views/authenticator/authenticator.component';
import {CartComponent} from './views/cart/cart.component';
import {AuthGuard} from './auth.guard';
import {CheckoutComponent} from './views/checkout/checkout.component';
import {OrderConfirmationComponent} from './views/order-confirmation/order-confirmation.component';
import {PaymentComponent} from './views/payment/payment.component';
import {OrderViewComponent} from './views/order-view/order-view.component';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: AuthenticatorComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'payment/:id', component: PaymentComponent },
  { path: 'orders', component: OrderViewComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
