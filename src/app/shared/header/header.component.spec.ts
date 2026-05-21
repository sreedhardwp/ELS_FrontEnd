import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { HeaderComponent } from './header.component';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../models/models';

class MockAuthService {
  private subject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.subject.asObservable();
  currentUser: CurrentUser | null = null;
  switchRole = jasmine.createSpy('switchRole');
  logout = jasmine.createSpy('logout');
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, CommonModule, RouterTestingModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  it('should initialize with no user and empty roles', () => {
    fixture.detectChanges();
    expect(component.currentUser).toBeNull();
    expect(component.roles).toEqual([]);
  });

  it('should toggle and close dropdown', () => {
    component.dropdownOpen = false;
    component.toggleDropdown();
    expect(component.dropdownOpen).toBeTrue();
    component.closeDropdown();
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should call authService.switchRole for allowed roles', () => {
    component.roles = ['Employee', 'Manager'];
    component.currentUser = { id: 1, token: 'token', role: 'Employee', name: 'Alice', allowedRoles: ['Employee', 'Manager'] };
    component.dropdownOpen = true;

    component.switchRole('Manager');

    expect(authService.switchRole).toHaveBeenCalledWith('Manager');
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should not switch to an unauthorized role', () => {
    component.roles = ['Employee'];
    component.currentUser = { id: 1, token: 'token', role: 'Employee', name: 'Alice', allowedRoles: ['Employee'] };
    component.dropdownOpen = true;

    component.switchRole('Manager');

    expect(authService.switchRole).not.toHaveBeenCalled();
    expect(component.dropdownOpen).toBeTrue();
  });

  it('should call logout and close dropdown', () => {
    component.dropdownOpen = true;

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should return correct role labels and badge classes', () => {
    expect(component.getRoleLabel('Employee')).toBe('Employee');
    expect(component.getRoleLabel('HRAdmin')).toBe('HR Admin');
    expect(component.getRoleLabel('Unknown')).toBe('Unknown');
    expect(component.getRoleBadgeClass('Manager')).toBe('badge-manager');
    expect(component.getRoleBadgeClass('Unknown')).toBe('');
  });
});