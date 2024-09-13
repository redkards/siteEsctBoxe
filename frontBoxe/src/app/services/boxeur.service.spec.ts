import { TestBed } from '@angular/core/testing';

import { BoxeurService } from './boxeur.service';

describe('BoxeurService', () => {
  let service: BoxeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxeurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
