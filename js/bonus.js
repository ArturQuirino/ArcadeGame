/* exported Bonus */
class Bonus {
  constructor() {
    this.column = Math.trunc(Math.random() * 11);
    this.row = Math.trunc(Math.random() * 5);
    this.x = 50 + this.column * 101;
    this.y = 60 + this.row * 80;
    this.image = 'images/bonus-coffee.png';
  }

  render() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
  }
}
