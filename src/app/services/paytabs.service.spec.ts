import { TestBed } from '@angular/core/testing';

import { PaytabsService } from './paytabs.service';

describe('PaytabsService', () => {
  let service: PaytabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaytabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
