import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../models/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: CurrentUser | null = null;

  dropdownOpen = false;

  // dynamic roles
  roles: string[] = [];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {

      this.currentUser = user;

      if (user) {

        // show only allowed roles
        this.roles = user.allowedRoles || [user.role];

      } else {

        this.roles = [];

      }

    });

  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  switchRole(role: string): void {

    // prevent invalid role switching
    if (!this.roles.includes(role)) {
      return;
    }

    this.authService.switchRole(role);

    this.dropdownOpen = false;
  }

  logout(): void {

    this.authService.logout();

    this.dropdownOpen = false;

  }

  getRoleLabel(role: string): string {

    const labels: Record<string, string> = {

      Employee: 'Employee',

      Manager: 'Manager',

      HRAdmin: 'HR Admin'

    };

    return labels[role] || role;

  }

  getRoleBadgeClass(role: string): string {

    const classes: Record<string, string> = {

      Employee: 'badge-employee',

      Manager: 'badge-manager',

      HRAdmin: 'badge-hr'

    };

    return classes[role] || '';

  }

}