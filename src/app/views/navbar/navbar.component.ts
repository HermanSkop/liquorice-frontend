import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthenticatorService} from '../../services/authenticator.service';
import {Subject, takeUntil} from 'rxjs';
import {CartService} from '../../services/cart.service';
import {Role} from '../../dtos/role';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  private destroy$ = new Subject<void>();
  isAuthenticated = false;
  isAdmin = false;

  constructor(private cartService: CartService, protected authenticatorService: AuthenticatorService) {
  }

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cartItemCount = this.cartService.getCartItemCount();
      });

    this.authenticatorService.authStateChanged.subscribe(authState => {
      this.isAuthenticated = authState;
    })

    this.isAdmin = this.authenticatorService.hasRole(Role.ADMIN)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authenticatorService.logout();
  }

  protected readonly Role = Role;
}
