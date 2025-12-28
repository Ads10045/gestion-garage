import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkToken());
  private userRole = new BehaviorSubject<string | null>(localStorage.getItem('user_role'));

  constructor() { }

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

  login(username: string, password: string): Observable<boolean> {
    let role: string | null = null;

    if (username === 'admin' && password === 'admin') {
      role = 'ADMIN';
    } else if (username === 'user' && password === 'user') {
      role = 'USER';
    }

    if (role) {
      localStorage.setItem('auth_token', 'fake-jwt-token');
      localStorage.setItem('user_role', role);
      this.userRole.next(role);
      this.loggedIn.next(true);
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    this.userRole.next(null);
    this.loggedIn.next(false);
  }
}
