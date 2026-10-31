import { TestBed } from '@angular/core/testing';

import { BoxeTypeService } from './boxe-type.service';

describe('BoxeTypeService', () => {
  let service: BoxeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxeTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
