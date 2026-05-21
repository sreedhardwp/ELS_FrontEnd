import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeaveService } from './leave.service';
import { environment } from '../../../environments/environment';

describe('LeaveService', () => {
  let service: LeaveService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeaveService]
    });

    service = TestBed.inject(LeaveService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch my leave requests', () => {
    service.getMyLeaves().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/leaverequest/myleave`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch pending leave requests', () => {
    service.getPendingLeaves().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/leaverequest/pending`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should send apply leave request', () => {
    service.applyLeave({ startDate: '2025-01-01', endDate: '2025-01-05', type: 'Annual', reason: 'Vacation' } as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/leaverequest/apply`);
    expect(req.request.method).toBe('POST');
    req.flush('Request created');
  });

  it('should cancel leave request', () => {
    service.cancelLeave(42).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/leaverequest/cancel/42`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Cancelled');
  });

  it('should submit approval processing', () => {
    service.processApproval({ requestId: 1, approved: true } as any).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/approval/process`);
    expect(req.request.method).toBe('POST');
    req.flush('Processed');
  });

  it('should load approval history', () => {
    service.getApprovalHistory().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/approval/history`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});