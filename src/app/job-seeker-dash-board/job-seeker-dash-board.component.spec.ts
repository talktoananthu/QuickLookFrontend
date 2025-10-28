import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerDashBoardComponent } from './job-seeker-dash-board.component';

describe('JobSeekerDashBoardComponent', () => {
  let component: JobSeekerDashBoardComponent;
  let fixture: ComponentFixture<JobSeekerDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekerDashBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobSeekerDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
