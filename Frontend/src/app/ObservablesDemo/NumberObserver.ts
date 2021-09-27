export class NumberObserver {
  constructor(private code: string) {}

  getObserver() {
    let _this = this;
    return {
      next(num: any): void {
        console.log(`Observer #${_this.code}: ${num}`);
      },
      complete(): void {
        console.log(`Observer #${_this.code}: finished`);
      },
    };
  }
}
