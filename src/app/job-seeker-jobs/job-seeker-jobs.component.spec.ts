import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerJobsComponent } from './job-seeker-jobs.component';

describe('JobSeekerJobsComponent', () => {
  let component: JobSeekerJobsComponent;
  let fixture: ComponentFixture<JobSeekerJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekerJobsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobSeekerJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
