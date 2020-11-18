import { TestBed } from '@angular/core/testing';

import { SubcatProductsService } from './subcat-products.service';

describe('SubcatProductsService', () => {
  let service: SubcatProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcatProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
