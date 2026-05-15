import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApprovalRequest, ApprovalResponse, CreateLeaveRequest, LeaveRequestResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly LEAVE_API = `${environment.apiUrl}/leaverequest`;
  private readonly APPROVAL_API = `${environment.apiUrl}/approval`;

  constructor(private http: HttpClient) {}

  getMyLeaves(): Observable<LeaveRequestResponse[]> {
    return this.http.get<LeaveRequestResponse[]>(`${this.LEAVE_API}/myleave`);
  }

  getPendingLeaves(): Observable<LeaveRequestResponse[]> {
    return this.http.get<LeaveRequestResponse[]>(`${this.LEAVE_API}/pending`);
  }

  applyLeave(dto: CreateLeaveRequest): Observable<string> {
    return this.http.post(`${this.LEAVE_API}/apply`, dto, { responseType: 'text' });
  }

  cancelLeave(id: number): Observable<string> {
    return this.http.delete(`${this.LEAVE_API}/cancel/${id}`, { responseType: 'text' });
  }

  processApproval(dto: ApprovalRequest): Observable<string> {
    return this.http.post(`${this.APPROVAL_API}/process`, dto, { responseType: 'text' });
  }

  getApprovalHistory(): Observable<ApprovalResponse[]> {
    return this.http.get<ApprovalResponse[]>(`${this.APPROVAL_API}/history`);
  }
}
