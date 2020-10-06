import { TestBed } from '@angular/core/testing';

import { HexesService } from './hexes.service';

describe('HexesService', () => {
  let service: HexesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HexesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
