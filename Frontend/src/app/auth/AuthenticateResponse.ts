export class AuthenticateResponse {
  constructor(
    public resultCode: number,
    public resultMessage: string,
    public authToken: string,
    public expiresInMinutes: number,
    public role: string
  ) {}
}
