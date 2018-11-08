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
        let newRow = Math.trunc(Math.random() * 5);
        while (newRow == this.row) {
            newRow = Math.trunc(Math.random() * 5);
        }
        this.column = Math.trunc(Math.random() * 9) + 1;
        this.row = newRow;
        this.x = 15 + this.column * 101;
        this.y = 85 + this.row * 80;
    }
}
