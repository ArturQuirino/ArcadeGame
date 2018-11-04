const initialPosition = {
    x: 515,
    y: 100 + 5*80,
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
            this.checkBonus();
        }
        break;
    case 'up':
        // if it is moving up, it shoudl check if it is the winning spot.
        if (this.y > 0) {
            this.y -= 83;
            this.checkBonus();
        }
        this.checkIfWin();
        break;
    case 'right':
        if (this.x < 1000) {
            this.x += 101;
            this.checkBonus();
        }
        break;
    case 'down':
        if (this.y < 420) {
            this.y += 83;
            this.checkBonus();
        }
        break;
    }
};

// Check if the player is in the toppest place of the game
Player.prototype.checkIfWin = function() {
    if (this.y < 50) {
        this.moveToBeginning();
        this.score += 100;
        rangeSpeed += 10;
        clearInterval(enemyInterval);
        if (timeBetweenEnemies > 400) {
            timeBetweenEnemies -= 100;
        }
        createNewEnemy();
        enemyInterval = setInterval(createNewEnemy, timeBetweenEnemies);
        refreshScore();
        // Show you win message
        showPanel(700, 'you-win');
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
    refreshScore();
    showPanel(700, 'you-loose');
};

Player.prototype.checkBonus = function() {
    if (bonus.x + 75 > player.x && bonus.x - 75 < player.x
		&& bonus.y + 40 > player.y + 20 && bonus.y - 40 < player.y + 20) {
        this.score += 50;
        rangeSpeed += 4;
        timeBetweenEnemies -= 40;
        refreshScore();
        showPanel(400, 'you-win-bonus');
        bonus.moveAround();
    }
};


function refreshScore() {
    document.getElementById('score').innerHTML = player.score;
};

function showPanel(timeStamp, cssClass) {
    document.getElementById(cssClass).style.opacity = '1';
    setTimeout(function() {
        document.getElementById(cssClass).style.opacity = '0';
    }, timeStamp);
};

