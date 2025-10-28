import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostMapComponent } from './job-post-map.component';

describe('JobPostMapComponent', () => {
  let component: JobPostMapComponent;
  let fixture: ComponentFixture<JobPostMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPostMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobPostMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
