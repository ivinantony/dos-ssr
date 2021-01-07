import { TestBed } from '@angular/core/testing';

import { CheckOutOfStockService } from './check-out-of-stock.service';

describe('CheckOutOfStockService', () => {
  let service: CheckOutOfStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckOutOfStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
