import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HrDashboardComponent } from './hr-dashboard.component';
import { AuthService } from '../../shared/services/auth.service';
import { LeaveService } from '../../shared/services/leave.service';

describe('HrDashboardComponent', () => {
  let component: HrDashboardComponent;
  let fixture: ComponentFixture<HrDashboardComponent>;
  let leaveService: any;

  beforeEach(async () => {
    leaveService = jasmine.createSpyObj('LeaveService', ['getApprovalHistory', 'getPendingLeaves']);
    leaveService.getApprovalHistory.and.returnValue(of([
      { employeeName: 'Alice', managerName: 'Bob', decision: 'Approved' },
      { employeeName: 'Charlie', managerName: 'Dana', decision: 'Rejected' }
    ]));
    leaveService.getPendingLeaves.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [HrDashboardComponent, RouterTestingModule],
      providers: [
        { provide: LeaveService, useValue: leaveService },
        { provide: AuthService, useValue: { currentUser$: of(null), logout: jasmine.createSpy(), switchRole: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load history data', () => {
    expect(component).toBeTruthy();
    expect(leaveService.getApprovalHistory).toHaveBeenCalled();
    expect(leaveService.getPendingLeaves).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.totalApproved).toBe(1);
    expect(component.totalRejected).toBe(1);
  });

  it('should filter approval history by search term and decision', () => {
    component.searchTerm = 'alice';
    component.filterDecision = 'Approved';

    const filtered = component.filteredHistory;
    expect(filtered.length).toBe(1);
    expect(filtered[0].employeeName).toBe('Alice');
  });

  it('should return decision class names', () => {
    expect(component.getDecisionClass('Approved')).toBe('status-approved');
    expect(component.getDecisionClass('Rejected')).toBe('status-rejected');
    expect(component.getDecisionClass('Pending')).toBe('');
  });
});