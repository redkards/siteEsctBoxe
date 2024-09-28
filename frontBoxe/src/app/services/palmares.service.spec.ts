import { TestBed } from '@angular/core/testing';

import { PalmaresService } from './palmares.service';

describe('PalmaresService', () => {
  let service: PalmaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalmaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
