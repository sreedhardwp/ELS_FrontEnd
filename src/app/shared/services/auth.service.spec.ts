import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should save auth data and emit current user on login', () => {
    const response = {
      id: 1,
      token: 'mock-token',
      role: 'Employee',
      name: 'Alice',
      allowedRoles: ['Employee']
    };

    service.login({ email: 'alice@example.com', password: 'password' }).subscribe(res => {
      expect(res.role).toBe('Employee');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(response);

    expect(localStorage.getItem('token')).toBe('mock-token');
    expect(localStorage.getItem('role')).toBe('Employee');
    expect(localStorage.getItem('name')).toBe('Alice');
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.currentUser?.name).toBe('Alice');
  });

  it('should clear storage and navigate to login on logout', () => {
    service['currentUserSubject'].next({
      id: 1,
      token: 'token',
      role: 'Employee',
      name: 'Alice',
      allowedRoles: ['Employee']
    });

    localStorage.setItem('token', 'token');
    localStorage.setItem('role', 'Employee');
    localStorage.setItem('name', 'Alice');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.currentUser).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should switch role when allowed and navigate to the correct route', () => {
    service['currentUserSubject'].next({
      id: 1,
      token: 'token',
      role: 'Employee',
      name: 'Alice',
      allowedRoles: ['Employee', 'Manager']
    });

    service.switchRole('Manager');

    expect(localStorage.getItem('role')).toBe('Manager');
    expect(service.currentUser?.role).toBe('Manager');
    expect(router.navigate).toHaveBeenCalledWith(['/manager']);
  });

  it('should ignore switching to unauthorized roles', () => {
    service['currentUserSubject'].next({
      id: 1,
      token: 'token',
      role: 'Employee',
      name: 'Alice',
      allowedRoles: ['Employee']
    });

    service.switchRole('Manager');

    expect(service.currentUser?.role).toBe('Employee');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});