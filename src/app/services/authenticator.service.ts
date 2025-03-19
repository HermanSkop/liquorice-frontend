import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse} from '../dtos/api-response';
import {apiUrl} from '../app.config';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  constructor(private http: HttpClient, private router: Router) {
  }

  login(email: string, password: string) {
    this.http.post<AuthResponse>(
      `${apiUrl}/auth/login`,
      {email, password}
    ).subscribe({
      next: authResponse => {
        this.saveTokens(authResponse);
        this.router.navigate(['/']);
      },
      error: authResponse => {
        throw Error(authResponse);
      }
    })
  }

  register(email: string, password: string){
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

  logout() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    this.http.post(`${apiUrl}/auth/logout`, {
      accessToken,
      refreshToken
    }).subscribe({
      next: resp => {
        this.clearTokens();
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Logout failed on server:', err);
        this.clearTokens();
        this.router.navigate(['/login']);
      }
    });
  }

  refreshToken() {
    return this.http.post<AuthResponse>(
      `${apiUrl}/auth/refresh`,
      { refreshToken: this.getRefreshToken() }
    ).pipe(
      tap((authResponse: AuthResponse) => {
        this.saveTokens(authResponse);
      }),
      catchError((error: any) => {
        console.log("Error while refreshing token", error);
        throw Error(error);
      })
    );
  }
}
