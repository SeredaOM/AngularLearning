import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ITile } from './itile';

@Injectable({
  providedIn: 'root',
})
export class HexesService {
  constructor(private httpClient: HttpClient) {}

  private static host = isDevMode() ? 'https://localhost:44362' : '/api';

  private static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  public getMap(mapId: number) {
    return this.httpClient.get(HexesService.host + '/hexes?mapId=' + mapId);
  }

  public postTile(tile: ITile) {
    return this.httpClient.post(
      HexesService.host + '/hexes',
      tile.serialize(),
      HexesService.httpOptions
    );
  }
}
