import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekerLayoutComponent } from './job-seeker-layout.component';

describe('JobSeekerLayoutComponent', () => {
  let component: JobSeekerLayoutComponent;
  let fixture: ComponentFixture<JobSeekerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekerLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobSeekerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
