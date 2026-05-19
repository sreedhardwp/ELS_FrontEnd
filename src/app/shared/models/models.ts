export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
}

export interface AuthResponse {
  id: number;
  token: string;
  role: string;
  name: string;
  allowedRoles: string[];
}

export interface LeaveRequestResponse {
  leaveRequestId: number;
  employeeName?: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  requestedOn: string;
  remarks?: string;
}

export interface CreateLeaveRequest {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApprovalRequest {
  leaveRequestId: number;
  decision: string;
  remarks?: string;
}

export interface ApprovalResponse {
  approvalId: number;
  leaveRequestId: number;
  employeeName: string;
  managerName: string;
  decision: string;
  remarks?: string;
  decisionDate: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  role: string;
  token: string;
  allowedRoles: string[];
}
