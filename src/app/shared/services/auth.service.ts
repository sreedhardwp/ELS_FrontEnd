import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, CurrentUser, LoginDto, RegisterDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): CurrentUser | null {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token && role && name) return { token, role, name };
    return null;
  }

  register(dto: RegisterDto): Observable<string> {
    return this.http.post(`${this.API}/register`, dto, { responseType: 'text' });
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, dto).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('name', res.name);
        this.currentUserSubject.next({ token: res.token, role: res.role, name: res.name });
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
    // For demo: switch active view role (UI only)
    const user = this.currentUser;
    if (user) {
      const updated = { ...user, role };
      localStorage.setItem('role', role);
      this.currentUserSubject.next(updated);
      this.navigateByRole(role);
    }
  }

  navigateByRole(role: string): void {
    if (role === 'Employee') this.router.navigate(['/employee']);
    else if (role === 'Manager') this.router.navigate(['/manager']);
    else if (role === 'HRAdmin') this.router.navigate(['/hr']);
  }
}
