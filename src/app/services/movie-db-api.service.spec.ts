import { TestBed } from '@angular/core/testing';

import { MovieDbApiService } from './movie-db-api.service';

describe('MovieDbApiService', () => {
  let service: MovieDbApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieDbApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
