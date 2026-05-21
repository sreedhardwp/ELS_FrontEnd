import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../shared/services/auth.service';

class MockAuthService {
  login = jasmine.createSpy('login').and.returnValue(of({ role: 'Employee' }));
  isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
  navigateByRole = jasmine.createSpy('navigateByRole');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  it('should show validation error when fields are empty', () => {
    component.email = '';
    component.password = '';

    component.onSubmit();

    expect(component.error).toBe('Please fill in all fields.');
    expect(component.loading).toBeFalse();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login and navigate on successful login', () => {
    component.email = 'user@example.com';
    component.password = 'password';

    component.onSubmit();

    expect(component.error).toBe('');
    expect(component.loading).toBeFalse();
    expect(authService.login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password' });
    expect(authService.navigateByRole).toHaveBeenCalledWith('Employee');
  });

  it('should show error message when login fails', () => {
    authService.login = jasmine.createSpy('login').and.returnValue(throwError(() => ({ error: 'Invalid credentials' })));
    component.email = 'user@example.com';
    component.password = 'password';

    component.onSubmit();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Invalid credentials');
  });
});