'use strict';

let baseSpeed = 30;
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
		&& this.y + 30 > player.y && this.y - 30 < player.y) {
    player.loosePoints();
    player.moveToBeginning();
  }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Our Player
const Player = function() {
  this.x = 505;
  this.y = 483;
  this.score = 0;
  this.sprite = 'images/char-boy.png';
};

// It is a method required by the game
Player.prototype.update = function() {};

// Draw the player on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle the input of the player, moving the character up, left, right or down
Player.prototype.handleInput = function(keyCode) {
  switch (keyCode) {
    case 'left':
      if (this.x > 0) {
        this.x -= 101;
      }
      break;
    case 'up':
      // if it is moving up, it shoudl check if it is the winning spot.
      if (this.y > 0) {
        this.y -= 83;
      }
      this.checkIfWin();
      break;
    case 'right':
      if (this.x < 1000) {
        this.x += 101;
      }
      break;
    case 'down':
      if (this.y < 460) {
        this.y += 83;
      }
      break;
  }
};

// Check if the player is in the toppest place of the game
Player.prototype.checkIfWin = function() {
  if (this.y < 0) {
    this.moveToBeginning();
    this.score += 100;
    baseSpeed += 15;
    clearInterval(enemyInterval);
    if (timeBetweenEnemies > 400) {
      timeBetweenEnemies -= 100;
    }
    createNewEnemy();
    enemyInterval = setInterval(createNewEnemy, timeBetweenEnemies);
    document.getElementById('score').innerHTML = this.score;
    // Show you win message
    document.getElementById('you-win').style.opacity = '1';
    setTimeout(function() {
      document.getElementById('you-win').style.opacity = '0';
    }, 700);
  }
};

// Move the player to the beginning
Player.prototype.moveToBeginning = function() {
  this.x = 505;
  this.y = 483;
};

Player.prototype.loosePoints = function() {
  baseSpeed -= 15;
  timeBetweenEnemies += 100;
  this.score -= 100;
  document.getElementById('score').innerHTML = this.score;
  document.getElementById('you-loose').style.opacity = '1';
  setTimeout(function() {
    document.getElementById('you-loose').style.opacity = '0';
  }, 700);
};

// List all enemies
const allEnemies = [];

// Create new enemy every 3 seconds.
let enemyInterval = setInterval(createNewEnemy, timeBetweenEnemies);

// create the first enemy
createNewEnemy();


/**
 * create new enemy with random position and speed
 * @return {void}
 */
function createNewEnemy() {
  const speed = Math.random()*70 + baseSpeed;
  const row = Math.trunc(Math.random()*5);
  allEnemies.push(new Enemy(row, speed));
}

// create the player
const player = new Player();

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
