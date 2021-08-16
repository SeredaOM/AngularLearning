export class Alert {
  public static get SuccessTimeout() {
    return 5000;
  }
  public static get DangerTimeout() {
    return 10000;
  }

  constructor(public type: Alert.AlertType, public message: string) {}
}

export namespace Alert {
  export enum AlertType {
    success = 'success',
    info = 'info',
    warning = 'warning',
    danger = 'danger',
    primary = 'primary',
    secondary = 'secondary',
    light = 'light',
    dark = 'dark',
  }
}
