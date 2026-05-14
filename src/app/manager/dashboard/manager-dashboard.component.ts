import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { LeaveService } from '../../shared/services/leave.service';
import { LeaveRequestResponse } from '../../shared/models/models';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {
  pendingLeaves: LeaveRequestResponse[] = [];
  loading = true;
  error = '';
  success = '';
  processingId: number | null = null;

  // Modal state
  showModal = false;
  selectedLeave: LeaveRequestResponse | null = null;
  decision = 'Approved';
  remarks = '';

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.loading = true;
    this.leaveService.getPendingLeaves().subscribe({
      next: (data) => { this.pendingLeaves = data; this.loading = false; },
      error: () => { this.loading = false; this.error = 'Failed to load pending leaves.'; }
    });
  }

  openModal(leave: LeaveRequestResponse): void {
    this.selectedLeave = leave;
    this.decision = 'Approved';
    this.remarks = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedLeave = null;
  }

  submitDecision(): void {
    if (!this.selectedLeave) return;
    this.processingId = this.selectedLeave.leaveRequestId;
    this.leaveService.processApproval({
      leaveRequestId: this.selectedLeave.leaveRequestId,
      decision: this.decision,
      remarks: this.remarks
    }).subscribe({
      next: () => {
        this.processingId = null;
        this.success = `Leave ${this.decision} successfully.`;
        this.closeModal();
        this.loadPending();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.processingId = null;
        this.error = err.error || 'Failed to process decision.';
        this.closeModal();
      }
    });
  }

  getDays(start: string, end: string): number {
    const s = new Date(start), e = new Date(end);
    return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;
  }
}
