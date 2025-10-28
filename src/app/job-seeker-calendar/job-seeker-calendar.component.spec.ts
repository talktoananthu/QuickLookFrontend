import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JObSeekerCalendarComponent } from './job-seeker-calendar.component';

describe('JObSeekerCalendarComponent', () => {
  let component: JObSeekerCalendarComponent;
  let fixture: ComponentFixture<JObSeekerCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JObSeekerCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JObSeekerCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
