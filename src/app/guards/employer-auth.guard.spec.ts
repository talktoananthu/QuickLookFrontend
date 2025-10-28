import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { employerAuthGuard } from './employer-auth.guard';

describe('employerAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => employerAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
