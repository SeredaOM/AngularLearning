import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HexesService {
  constructor(private httpClient: HttpClient) {}

  public get() {
    let host = isDevMode() ? 'https://localhost:44362' : '/api';
    return this.httpClient.get(host + '/hexes?mapId=3');
  }
}
