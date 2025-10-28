import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParTimeComponent } from './par-time.component';

describe('ParTimeComponent', () => {
  let component: ParTimeComponent;
  let fixture: ComponentFixture<ParTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
