import { TestBed } from '@angular/core/testing';

import { CartcountService } from './cartcount.service';

describe('CartcountService', () => {
  let service: CartcountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartcountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
