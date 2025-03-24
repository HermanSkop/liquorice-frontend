import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
};
export const pageSize = 10;
export const apiVersion = 1;
export const apiUrl = `http://localhost:8080/api/v${apiVersion}`;
export const stripePublicKey = 'pk_test_51Oj66fC0thQyOQDadjcQBNcmOFB0T78o1wg1efnFXyMZsZLEHRqLITD8mIFlUuOXJKoSN0U8rjZvUIQxuWc9RQ9r00CuUdSGnl'
