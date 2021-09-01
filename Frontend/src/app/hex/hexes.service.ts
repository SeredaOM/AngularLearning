import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiService } from '../api.service';
import { TileModel } from '../Models/TileModel';
import { MapModel } from '../Models/MapModel';

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

  public getMapDataAvailableForPlayer(playerId: number) {
    return this.httpClient.get(ApiService.getHost() + '/hexes/mapsForPlayer/' + playerId);
  }

  public getMap(mapId: number) {
    return this.httpClient.get(ApiService.getHost() + '/hexes/map/' + mapId);
  }

  public saveMapTiles(mapId: number, mapModel: MapModel) {
    return this.httpClient.post(
      ApiService.getHost() + '/hexes/maptiles/' + mapId,
      JSON.stringify(mapModel),
      HexesService.httpOptions
    );
  }

  public postTile(tile: TileModel) {
    return this.httpClient.post(ApiService.getHost() + '/hexes', JSON.stringify(tile), HexesService.httpOptions);
  }
}
