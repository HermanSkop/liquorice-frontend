import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticatorService } from '../services/authenticator.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticatorService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
      return next.handle(request);
    }

    return this.addTokenToRequest(request, next).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handleUnauthorizedError(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<unknown>, next: HttpHandler) {
    const token = this.auth.getAccessToken();
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(request);
  }

  private handleUnauthorizedError(request: HttpRequest<unknown>, next: HttpHandler) {
    const refreshToken = this.auth.getRefreshToken();
    if (!refreshToken) {
      this.auth.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.auth.refreshToken().pipe(
      switchMap(() => {
        return this.addTokenToRequest(request, next);
      }),
      catchError(error => {
        this.auth.logout();
        return throwError(() => error);
      })
    );
  }
}
