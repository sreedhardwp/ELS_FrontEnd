import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { authGuard, roleGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;
  let authService: any;

  beforeEach(() => {
    authService = { isLoggedIn: jasmine.createSpy() };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthService, useValue: authService }]
    });
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should allow activation when logged in', () => {
    authService.isLoggedIn.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow role-based activation when role is allowed', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getRole = jasmine.createSpy().and.returnValue('Employee');

    const guardFn = roleGuard(['Employee']);
    const result = TestBed.runInInjectionContext(() => guardFn({} as any, {} as any));

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should reject unauthorized role and redirect', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getRole = jasmine.createSpy().and.returnValue('Employee');

    const guardFn = roleGuard(['Manager']);
    const result = TestBed.runInInjectionContext(() => guardFn({} as any, {} as any));

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});