/* exported Bonus */
class Bonus {
    constructor() {
        this.generateNewPosition();
        this.image = 'images/bonus-coffee.png';
    }

    render() {
        ctx.drawImage(Resources.get(this.image), this.x, this.y);
    }

    moveAround() {
        this.generateNewPosition();
        ctx.drawImage(Resources.get(this.image), this.x, this.y);
    }

    generateNewPosition() {
        this.column = Math.trunc(Math.random() * 10);
        this.row = Math.trunc(Math.random() * 4);
        this.x = 50 + this.column * 101;
        this.y = this.row * 80;
    }
}
