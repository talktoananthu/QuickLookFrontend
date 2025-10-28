import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JObSeekerAppliedComponent } from './job-seeker-applied.component';

describe('JObSeekerAppliedComponent', () => {
  let component: JObSeekerAppliedComponent;
  let fixture: ComponentFixture<JObSeekerAppliedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JObSeekerAppliedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JObSeekerAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
