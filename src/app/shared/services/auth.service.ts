import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  CurrentUser,
  LoginDto,
  RegisterDto
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = `${environment.apiUrl}/auth`;

  private currentUserSubject =
    new BehaviorSubject<CurrentUser | null>(this.loadUser());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private loadUser(): CurrentUser | null {

    const token = localStorage.getItem('token');

    const role = localStorage.getItem('role');

    const name = localStorage.getItem('name');

    const allowedRoles =
      JSON.parse(localStorage.getItem('allowedRoles') || '[]');

    if (token && role && name) {

      return {
        id: 0,
        token,
        role,
        name,
        allowedRoles
      };

    }

    return null;
  }

  register(dto: RegisterDto): Observable<string> {

    return this.http.post(
      `${this.API}/register`,
      dto,
      { responseType: 'text' }
    );

  }

  login(dto: LoginDto): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(`${this.API}/login`, dto)
      .pipe(

        tap(res => {

          // save to local storage
          localStorage.setItem('token', res.token);

          localStorage.setItem('role', res.role);

          localStorage.setItem('name', res.name);

          localStorage.setItem(
            'allowedRoles',
            JSON.stringify(res.allowedRoles || [res.role])
          );

          // update observable
          this.currentUserSubject.next({

            id: res.id || 0,

            token: res.token,

            role: res.role,

            name: res.name,

            allowedRoles: res.allowedRoles || [res.role]

          });

        })

      );

  }

  logout(): void {

    localStorage.clear();

    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);

  }

  get currentUser(): CurrentUser | null {

    return this.currentUserSubject.value;

  }

  isLoggedIn(): boolean {

    return !!this.currentUserSubject.value;

  }

  getRole(): string {

    return this.currentUser?.role ?? '';

  }

  switchRole(role: string): void {

    const user = this.currentUser;

    if (!user) return;

    // prevent switching to unauthorized role
    if (!user.allowedRoles.includes(role)) {
      return;
    }

    const updated: CurrentUser = {

      ...user,

      role

    };

    localStorage.setItem('role', role);

    this.currentUserSubject.next(updated);

    this.navigateByRole(role);

  }

  navigateByRole(role: string): void {

    if (role === 'Employee') {

      this.router.navigate(['/employee']);

    }

    else if (role === 'Manager') {

      this.router.navigate(['/manager']);

    }

    else if (role === 'HRAdmin') {

      this.router.navigate(['/hr']);

    }

  }

}