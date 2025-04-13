import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthResponse} from '../dtos/api-response';
import {authServerUrl} from '../app.config';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

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

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${authServerUrl}/login`,
      {email, password}
    ).pipe(
      tap(authResponse => {
        this.saveTokens(authResponse);
        console.log('auth state modified');
        this.authStateSubject.next(true);
      })
    );
  }


  loginWithGoogle(credential: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${authServerUrl}/login/google`,
      null,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${credential}`
        })
      }
    ).pipe(
      tap(authResponse => {
        this.saveTokens(authResponse);
        this.authStateSubject.next(true);
      })
    );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${authServerUrl}/register`,
      {email, password}
    ).pipe(
      tap(authResponse => {
        this.login(email, password);
      })
    );
  }

  logout() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    this.http.post(`${authServerUrl}/logout`, {
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
    console.log('accessToken', sessionStorage.getItem('accessToken'));
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshToken() {
    return this.http.post<AuthResponse>(
      `${authServerUrl}/refresh`,
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

  hasRole(roleName: string): boolean {
    roleName = roleName.toUpperCase();
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decodedToken: any = jwt_decode.jwtDecode(token);
      return Array.isArray(decodedToken.roles) && decodedToken.roles.includes(roleName);
    } catch (error) {
      console.error('Error decoding token', error);
      return false;
    }
  }
}
