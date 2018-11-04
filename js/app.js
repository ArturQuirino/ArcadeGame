const baseSpeed = 30;
/* exported rangeSpeed timeBetweenEnemies */
let rangeSpeed = 70;
let timeBetweenEnemies = 3000;

// Enemies our player must avoid
const Enemy = function(row, speed) {
    this.x = 0;
    this.y = 60 + row*80;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;
    if (this.x + 75 > player.x && this.x - 75 < player.x
		&& this.y + 30 > player.y + 40 && this.y - 30 < player.y + 40) {
        player.loosePoints();
        player.moveToBeginning();
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// List all enemies
const allEnemies = [];

/* exported enemyInterval */
// Create new enemy every 3 seconds.
let enemyInterval = setInterval(createNewEnemy, timeBetweenEnemies);

// create the first enemy
createNewEnemy();


/**
 * create new enemy with random position and speed
 * @return {void}
 */
function createNewEnemy() {
    const speed = Math.random()*rangeSpeed + baseSpeed;
    const row = Math.trunc(Math.random()*5);
    allEnemies.push(new Enemy(row, speed));
}

// create the player
const player = new Player();

/* exported bonus */
let bonus = new Bonus();

document.getElementById('score').innerHTML = player.score;

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
