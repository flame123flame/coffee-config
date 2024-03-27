export class ConnectWorld {
  static random(number,max=100) {
    return Array.from({ length: number }).map(() => {
      return Math.floor(Math.random() * max);
    });
  }
}
