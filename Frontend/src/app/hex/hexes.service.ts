import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ITile } from './itile';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class HexesService {
  constructor(private httpClient: HttpClient, private apiService: ApiService) {}

  private static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  public getMap(mapId: number) {
    return this.httpClient.get(ApiService.getHost() + '/hexes?mapId=' + mapId);
  }

  public postTile(tile: ITile) {
    return this.httpClient.post(
      ApiService.getHost() + '/hexes',
      tile.serialize(),
      HexesService.httpOptions
    );
  }
}
