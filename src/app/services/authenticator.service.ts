import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse} from '../dtos/api-response';
import {apiUrl} from '../app.config';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  private authStateSubject = new BehaviorSubject<boolean>(this.hasToken());

  authStateChanged: Observable<boolean> = this.authStateSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }

  login(email: string, password: string) {
    this.http.post<AuthResponse>(
      `${apiUrl}/auth/login`,
      {email, password}
    ).subscribe({
      next: authResponse => {
        this.saveTokens(authResponse);
        console.log('auth state modified');
        this.authStateSubject.next(true);
        this.router.navigate(['/']);
      },
      error: authResponse => {
        throw Error(authResponse);
      }
    })
  }

  logout() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    this.http.post(`${apiUrl}/auth/logout`, {
      accessToken,
      refreshToken
    }).subscribe({
      next: resp => {
        this.clearTokens();
        this.authStateSubject.next(false);
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error(err);
        this.clearTokens();
        this.authStateSubject.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  register(email: string, password: string) {
    this.http.post<AuthResponse>(
      `${apiUrl}/auth/register`,
      {email, password}
    ).subscribe({
      next: authResponse => {
        this.login(email, password);
      },
      error: authResponse => {
        throw Error(authResponse);
      }
    })
  }

  saveTokens(authResponse: AuthResponse): void {
    sessionStorage.setItem('accessToken', authResponse.accessToken);
    sessionStorage.setItem('refreshToken', authResponse.refreshToken);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  }

  clearTokens(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshToken() {
    return this.http.post<AuthResponse>(
      `${apiUrl}/auth/refresh`,
      {refreshToken: this.getRefreshToken()}
    ).pipe(
      tap((authResponse: AuthResponse) => {
        console.log('refreshed token', authResponse);
        this.saveTokens(authResponse);
      }),
      catchError((error: any) => {
        console.log("Error while refreshing token", error);
        throw Error(error);
      })
    );
  }
}
