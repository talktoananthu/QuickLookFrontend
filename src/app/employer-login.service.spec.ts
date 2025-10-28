import { TestBed } from '@angular/core/testing';

import { EmployerLoginService } from './employer-login.service';

describe('EmployerLoginService', () => {
  let service: EmployerLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployerLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
