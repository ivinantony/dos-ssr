import { TestBed } from '@angular/core/testing';

import { AutocloseOverlayService } from './autoclose-overlay.service';

describe('AutocloseOverlayService', () => {
  let service: AutocloseOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutocloseOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
