import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HexesService {
  //private HEXES_SERVER_URL = 'http://localhost:81/api/hexes';
  //private HEXES_SERVER_URL = 'http://localhost:81/api/weatherforecast';
  private HEXES_SERVER_URL = 'https://localhost:44362/hexes';
  //private HEXES_SERVER_URL = 'http://localhost:3000/products';

  constructor(private httpClient: HttpClient) { }

  public get() {
    return this.httpClient.get(this.HEXES_SERVER_URL + "?mapId=3");
  }
}
