export class PlayerModel {
  constructor(
    public id: number = 0,
    public nick: string = null,
    public email: string = null,
    public firstName: string = null,
    public lastName: string = null,
    public role: string = null
  ) {}

  public static getPlayerFromStore() {
    const player = new PlayerModel(
      parseInt(localStorage.getItem(PlayerModel.Id)),
      localStorage.getItem(PlayerModel.Nick),
      localStorage.getItem(PlayerModel.Email),
      localStorage.getItem(PlayerModel.FirstName),
      localStorage.getItem(PlayerModel.LastName),
      localStorage.getItem(PlayerModel.Role)
    );
    return player;
  }

  public static storeItems(player) {
    localStorage.setItem(PlayerModel.Id, player.id.toString());
    localStorage.setItem(PlayerModel.Nick, player.nick);
    localStorage.setItem(PlayerModel.Email, player.email);
    localStorage.setItem(PlayerModel.FirstName, player.firstName);
    localStorage.setItem(PlayerModel.LastName, player.lastName);
    if (player.role) localStorage.setItem(PlayerModel.Role, player.role);
  }

  public static removeItems() {
    localStorage.removeItem(PlayerModel.Id);
    localStorage.removeItem(PlayerModel.Nick);
    localStorage.removeItem(PlayerModel.Email);
    localStorage.removeItem(PlayerModel.FirstName);
    localStorage.removeItem(PlayerModel.LastName);
    localStorage.removeItem(PlayerModel.Role);
  }

  public static get Id() {
    return 'id';
  }
  public static get Nick() {
    return 'nick';
  }
  public static get Email() {
    return 'email';
  }
  public static get FirstName() {
    return 'firstName';
  }
  public static get LastName() {
    return 'lastName';
  }
  public static get Role() {
    return 'role';
  }
}
