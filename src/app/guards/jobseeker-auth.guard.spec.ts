import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { jobseekerAuthGuard } from './jobseeker-auth.guard';

describe('jobseekerAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => jobseekerAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
