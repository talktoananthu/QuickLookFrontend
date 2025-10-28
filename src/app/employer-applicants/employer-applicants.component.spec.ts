import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerApplicantsComponent } from './employer-applicants.component';

describe('EmployerApplicantsComponent', () => {
  let component: EmployerApplicantsComponent;
  let fixture: ComponentFixture<EmployerApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerApplicantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployerApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
