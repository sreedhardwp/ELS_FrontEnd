import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ManagerDashboardComponent } from './manager-dashboard.component';
import { AuthService } from '../../shared/services/auth.service';
import { LeaveService } from '../../shared/services/leave.service';

describe('ManagerDashboardComponent', () => {
  let component: ManagerDashboardComponent;
  let fixture: ComponentFixture<ManagerDashboardComponent>;
  let leaveService: any;

  beforeEach(async () => {
    leaveService = jasmine.createSpyObj('LeaveService', ['getPendingLeaves', 'processApproval']);
    leaveService.getPendingLeaves.and.returnValue(of([]));
    leaveService.processApproval.and.returnValue(of('processed'));

    await TestBed.configureTestingModule({
      imports: [ManagerDashboardComponent, RouterTestingModule],
      providers: [
        { provide: LeaveService, useValue: leaveService },
        { provide: AuthService, useValue: { currentUser$: of(null), logout: jasmine.createSpy(), switchRole: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load pending leaves on init', () => {
    expect(component).toBeTruthy();
    expect(leaveService.getPendingLeaves).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should open and close modal correctly', () => {
    const leave = { leaveRequestId: 5, startDate: '2025-06-01', endDate: '2025-06-03' } as any;
    component.openModal(leave);

    expect(component.selectedLeave).toBe(leave);
    expect(component.showModal).toBeTrue();
    expect(component.decision).toBe('Approved');

    component.closeModal();
    expect(component.showModal).toBeFalse();
    expect(component.selectedLeave).toBeNull();
  });

  it('should submit decision and reload pending list', fakeAsync(() => {
    component.openModal({ leaveRequestId: 10 } as any);
    component.submitDecision();

    expect(component.processingId).toBeNull();
    expect(component.success).toBe('Leave Approved successfully.');
    expect(leaveService.processApproval).toHaveBeenCalledWith({ leaveRequestId: 10, decision: 'Approved', remarks: '' });
    expect(leaveService.getPendingLeaves).toHaveBeenCalledTimes(2);
    tick(3000);
    expect(component.success).toBe('');
  }));

  it('should compute day count', () => {
    expect(component.getDays('2025-06-01', '2025-06-05')).toBe(5);
  });
});