import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerInboxComponent } from './job-seeker-inbox.component';

describe('JobSeekerInboxComponent', () => {
  let component: JobSeekerInboxComponent;
  let fixture: ComponentFixture<JobSeekerInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekerInboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobSeekerInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
