const initialPosition = {
  x: 475,
  y: 20 + 5*80,
};

// Our Player
const Player = function() {
  this.x = initialPosition.x;
  this.y = initialPosition.y;
  this.score = 0;
  this.sprite = 'images/char-artur.png';
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
      if (this.y < 420) {
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
    rangeSpeed += 10;
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
  this.x = initialPosition.x;
  this.y = initialPosition.y;
};

Player.prototype.loosePoints = function() {
  rangeSpeed -= 10;
  timeBetweenEnemies += 100;
  this.score -= 100;
  document.getElementById('score').innerHTML = this.score;
  document.getElementById('you-loose').style.opacity = '1';
  setTimeout(function() {
    document.getElementById('you-loose').style.opacity = '0';
  }, 700);
};