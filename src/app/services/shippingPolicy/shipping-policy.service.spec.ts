import { TestBed } from '@angular/core/testing';

import { ShippingPolicyService } from './shipping-policy.service';

describe('ShippingPolicyService', () => {
  let service: ShippingPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
