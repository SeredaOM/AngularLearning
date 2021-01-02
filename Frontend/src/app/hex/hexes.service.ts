import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

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
      //Authorization: 'my-auth-token',
    }),
  };

  public getMap(mapId: number) {
    return this.httpClient.get(HexesService.host + '/hexes?mapId=' + mapId);
  }

  public postTile(tile: ITile) {
    return this.httpClient.post(
      HexesService.host + '/tiles',
      `{"x":10,"y":-2,"terrain":"Mountain","resource":null}`,
      HexesService.httpOptions
    );
  }
}
