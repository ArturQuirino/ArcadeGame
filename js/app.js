var Enemy = function(row, speed) {
    this.x = 0;
    this.y = 60 + row*80;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
  this.x += this.speed*dt;
  if (this.x + 75 > player.x && this.x - 75 < player.x && this.y + 30 > player.y && this.y - 30 < player.y) {
          player.moveToBeginning();
  }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(){};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(keyCode){
    switch(keyCode){
        case 'left':
            if(this.x > 0){
              this.x -= 101;
            }
            break;
        case 'up':
            if(this.y > 0){
              this.y -= 83
            }
            this.checkIfWin();
            break;
        case 'right':
            if(this.x < 400){
              this.x += 101;
            }
            break;
        case 'down':
            if(this.y < 400) {
              this.y += 83;
            }
            break;
    }
};

Player.prototype.checkIfWin = function() {
  if (this.y < 0) {
    this.moveToBeginning();
  }
}

Player.prototype.moveToBeginning = function(){
  this.x = 200;
  this.y = 400;
}

let allEnemies = [];
setInterval(createNewEnemy,3000);
createNewEnemy();

function createNewEnemy() {
    const speed = Math.random()*70 + 30;
    const row = Math.trunc(Math.random()*3);
    allEnemies.push(new Enemy(row, speed));
}
let player = new Player();


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
