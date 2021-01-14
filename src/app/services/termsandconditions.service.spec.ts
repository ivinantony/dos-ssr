import { TestBed } from '@angular/core/testing';

import { TermsandconditionsService } from './termsandconditions.service';

describe('TermsandconditionsService', () => {
  let service: TermsandconditionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TermsandconditionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
