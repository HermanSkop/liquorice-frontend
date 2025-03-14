import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthenticatorService} from '../../services/authenticator.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authenticatorService: AuthenticatorService) {}

  isLoggedIn(): boolean {
    return this.authenticatorService.isLoggedIn();
  }

  logout() {
    this.authenticatorService.logout();
  }
}
