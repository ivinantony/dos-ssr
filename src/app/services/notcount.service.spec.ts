import { TestBed } from '@angular/core/testing';

import { NotcountService } from './notcount.service';

describe('NotcountService', () => {
  let service: NotcountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotcountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
