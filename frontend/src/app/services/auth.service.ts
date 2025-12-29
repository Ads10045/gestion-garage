import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkToken());
  private userRole = new BehaviorSubject<string | null>(localStorage.getItem('user_role'));

  constructor(private http: HttpClient) { }

  private checkToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  getCurrentUser(): boolean {
    return this.loggedIn.value;
  }

  isAdmin(): boolean {
    return this.userRole.value === 'ADMIN';
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>('http://localhost:3000/api/auth/login', { email, password })
      .pipe(
        map(response => {
          if (response && response.access_token) {
            localStorage.setItem('auth_token', response.access_token);
            // For now, assuming admin if email contains admin or role is returned
            const role = email.includes('admin') ? 'ADMIN' : 'USER';
            localStorage.setItem('user_role', role);
            this.userRole.next(role);
            this.loggedIn.next(true);
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    this.userRole.next(null);
    this.loggedIn.next(false);
  }
}
