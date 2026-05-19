import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { LeaveService } from '../../shared/services/leave.service';
import { AuthService } from '../../shared/services/auth.service';
import { LeaveRequestResponse, CreateLeaveRequest } from '../../shared/models/models';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  myLeaves: LeaveRequestResponse[] = [];
  loading = true;
  applyLoading = false;
  error = '';
  success = '';
  showApplyForm = false;
  cancellingId: number | null = null;

  leaveTypes = [
  { id: 1, name: 'Annual Leave' },
  { id: 2, name: 'Sick Leave' },
  { id: 3, name: 'Casual Leave' },
  { id: 4, name: 'Maternity Leave' }
];

  newLeave: CreateLeaveRequest = {
    leaveTypeId: 1,
    startDate: '',
    endDate: '',
    reason: ''
  };

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading = true;
    this.leaveService.getMyLeaves().subscribe({
      next: (data) => { this.myLeaves = data; this.loading = false; },
      error: () => { this.loading = false; this.error = 'Failed to load leaves.'; }
    });
  }

  applyLeave(): void {
    if (!this.newLeave.startDate || !this.newLeave.endDate || !this.newLeave.reason) {
      this.error = 'Please fill all fields.'; return;
    }
     if (this.newLeave.endDate < this.newLeave.startDate) {
    this.error = 'End Date cannot be earlier than Start Date.';
    return;
  }
    this.applyLoading = true;
    this.error = '';
    this.leaveService.applyLeave(this.newLeave).subscribe({
      next: () => {
        this.applyLoading = false;
        this.success = 'Leave applied successfully!';
        this.showApplyForm = false;
        this.resetForm();
        this.loadLeaves();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.applyLoading = false;
        this.error = err.error || 'Failed to apply leave.';
      }
    });
  }

  cancelLeave(id: number): void {
    this.cancellingId = id;
    this.leaveService.cancelLeave(id).subscribe({
      next: () => {
        this.cancellingId = null;
        this.success = 'Leave cancelled.';
        this.loadLeaves();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.cancellingId = null;
        this.error = err.error || 'Cannot cancel this leave.';
      }
    });
  }

  resetForm(): void {
    this.newLeave = { leaveTypeId: 1, startDate: '', endDate: '', reason: '' };
  }

  get pendingCount(): number { return this.myLeaves.filter(l => l.status === 'Pending').length; }
  get approvedCount(): number { return this.myLeaves.filter(l => l.status === 'Approved').length; }
  get rejectedCount(): number { return this.myLeaves.filter(l => l.status === 'Rejected').length; }

  getStatusClass(status: string): string {
    return { Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' }[status] || '';
  }

  getDays(start: string, end: string): number {
    const s = new Date(start), e = new Date(end);
    return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;
  }
  
}
