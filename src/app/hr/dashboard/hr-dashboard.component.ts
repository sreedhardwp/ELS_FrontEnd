import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { LeaveService } from '../../shared/services/leave.service';
import { ApprovalResponse, LeaveRequestResponse } from '../../shared/models/models';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  approvalHistory: ApprovalResponse[] = [];
  pendingLeaves: LeaveRequestResponse[] = [];
  activeTab: 'history' | 'pending' = 'history';
  loading = true;
  error = '';
  searchTerm = '';
  filterDecision = '';

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.leaveService.getApprovalHistory().subscribe({
      next: (data) => { this.approvalHistory = data; this.loading = false; },
      error: () => { this.loading = false; this.error = 'Failed to load data.'; }
    });
    this.leaveService.getPendingLeaves().subscribe({
      next: (data) => { this.pendingLeaves = data; },
      error: () => {}
    });
  }

  get filteredHistory(): ApprovalResponse[] {
    let list = this.approvalHistory;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(a =>
        a.employeeName.toLowerCase().includes(term) ||
        a.managerName.toLowerCase().includes(term)
      );
    }
    if (this.filterDecision) {
      list = list.filter(a => a.decision === this.filterDecision);
    }
    return list;
  }

  get totalApproved(): number { return this.approvalHistory.filter(a => a.decision === 'Approved').length; }
  get totalRejected(): number { return this.approvalHistory.filter(a => a.decision === 'Rejected').length; }

  getDecisionClass(decision: string): string {
    return { Approved: 'status-approved', Rejected: 'status-rejected' }[decision] || '';
  }
}
