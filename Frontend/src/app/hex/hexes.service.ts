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

  public getMapDataAvailableForPlayer() {
    return this.httpClient.get(ApiService.getHost() + '/hexes/mapsForPlayer');
  }

  public getMap(mapId: number) {
    return this.httpClient.get(ApiService.getHost() + '/hexes/map/' + mapId);
  }

  public saveMapTiles(mapId: number, mapName: string, mapTiles: TileModel[]) {
    return this.httpClient.post(
      `${ApiService.getHost()}/hexes/SaveMapChanges/${mapId}/${mapName}`,
      JSON.stringify(mapTiles),
      HexesService.httpOptions
    );
  }

  public postTile(tile: TileModel) {
    return this.httpClient.post(ApiService.getHost() + '/hexes', JSON.stringify(tile), HexesService.httpOptions);
  }
}
