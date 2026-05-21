import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { AuthService } from '../../shared/services/auth.service';
import { LeaveService } from '../../shared/services/leave.service';

describe('EmployeeDashboardComponent', () => {
  let component: EmployeeDashboardComponent;
  let fixture: ComponentFixture<EmployeeDashboardComponent>;
  let leaveService: any;

  beforeEach(async () => {
    leaveService = jasmine.createSpyObj('LeaveService', [
      'getMyLeaves',
      'applyLeave',
      'cancelLeave'
    ]);
    leaveService.getMyLeaves.and.returnValue(of([]));
    leaveService.applyLeave.and.returnValue(of('applied'));
    leaveService.cancelLeave.and.returnValue(of('cancelled'));

    await TestBed.configureTestingModule({
      imports: [EmployeeDashboardComponent, RouterTestingModule],
      providers: [
        { provide: LeaveService, useValue: leaveService },
        { provide: AuthService, useValue: { currentUser$: of(null) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load leaves on init', () => {
    expect(component).toBeTruthy();
    expect(leaveService.getMyLeaves).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should validate applyLeave fields', () => {
    component.newLeave = { leaveTypeId: 1, startDate: '', endDate: '', reason: '' };
    component.applyLeave();

    expect(component.error).toBe('Please fill all fields.');
    expect(leaveService.applyLeave).not.toHaveBeenCalled();
  });

  it('should validate date order before applying leave', () => {
    component.newLeave = { leaveTypeId: 1, startDate: '2025-06-10', endDate: '2025-06-09', reason: 'Test' };
    component.applyLeave();

    expect(component.error).toBe('End Date cannot be earlier than Start Date.');
    expect(leaveService.applyLeave).not.toHaveBeenCalled();
  });

  it('should apply leave successfully and reset form', fakeAsync(() => {
    component.newLeave = { leaveTypeId: 1, startDate: '2025-06-10', endDate: '2025-06-12', reason: 'Test' };
    component.applyLeave();

    expect(component.applyLoading).toBeFalse();
    expect(component.success).toBe('Leave applied successfully!');
    expect(component.showApplyForm).toBeFalse();
    expect(leaveService.applyLeave).toHaveBeenCalled();
    tick(3000);
    expect(component.success).toBe('');
  }));

  it('should cancel leave and set success message', fakeAsync(() => {
    component.cancelLeave(7);
    expect(component.cancellingId).toBeNull();
    expect(component.success).toBe('Leave cancelled.');
    expect(leaveService.cancelLeave).toHaveBeenCalledWith(7);
    tick(3000);
    expect(component.success).toBe('');
  }));

  it('should compute status counts and classes correctly', () => {
    component.myLeaves = [
      { leaveRequestId: 1, status: 'Pending' },
      { leaveRequestId: 2, status: 'Approved' },
      { leaveRequestId: 3, status: 'Rejected' }
    ] as any[];

    expect(component.pendingCount).toBe(1);
    expect(component.approvedCount).toBe(1);
    expect(component.rejectedCount).toBe(1);
    expect(component.getStatusClass('Approved')).toBe('status-approved');
    expect(component.getStatusClass('Unknown')).toBe('');
    expect(component.getDays('2025-06-01', '2025-06-03')).toBe(3);
  });
});