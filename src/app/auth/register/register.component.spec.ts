import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../shared/services/auth.service';

class MockAuthService {
  register = jasmine.createSpy('register').and.returnValue(of('Registered'));
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should show validation error when required fields are missing', () => {
    component.name = '';
    component.email = '';
    component.password = '';
    component.department = '';

    component.onSubmit();

    expect(component.error).toBe('Please fill in all fields.');
    expect(component.loading).toBeFalse();
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should register successfully and navigate after delay', fakeAsync(() => {
    component.name = 'John Doe';
    component.email = 'john@example.com';
    component.password = 'password';
    component.department = 'HR';
    component.role = 'HRAdmin';

    component.onSubmit();

    expect(component.loading).toBeFalse();
    expect(component.success).toContain('Account created! Redirecting to login...');
    tick(1500);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error message when registration fails', () => {
    authService.register = jasmine.createSpy('register').and.returnValue(throwError(() => ({ error: 'Registration failed' })));

    component.name = 'John Doe';
    component.email = 'john@example.com';
    component.password = 'password';
    component.department = 'HR';
    component.role = 'HRAdmin';

    component.onSubmit();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Registration failed');
  });
});