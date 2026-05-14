import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  department = '';
  role = 'Employee';
  loading = false;
  error = '';
  success = '';
  showPassword = false;

  roles = ['Employee', 'Manager', 'HRAdmin'];
  departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Design'];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password || !this.department) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      department: this.department,
      role: this.role
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Registration failed. Try again.';
      }
    });
  }
}
