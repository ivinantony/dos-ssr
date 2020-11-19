import { TestBed } from '@angular/core/testing';

import { BrandProductService } from './brand-product.service';

describe('BrandProductService', () => {
  let service: BrandProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
