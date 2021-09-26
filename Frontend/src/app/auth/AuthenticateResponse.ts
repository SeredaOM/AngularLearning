import { PlayerModel } from '../Models/PlayerModel';

export class AuthenticateResponse {
  constructor(
    public resultCode: number,
    public resultMessage: string,
    public authToken: string = null,
    public expiresInMinutes: number = 0,
    public player: PlayerModel = null
  ) {}
}
