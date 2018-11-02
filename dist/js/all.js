/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function() {
  const resourceCache = {};
  const readyCallbacks = [];

  /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
  function load(urlOrArr) {
    if (urlOrArr instanceof Array) {
      /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
      urlOrArr.forEach(function(url) {
        _load(url);
      });
    } else {
      /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
      _load(urlOrArr);
    }
  }

  /* This is our private image loader function, it is
     * called by the public image loader function.
     */
  function _load(url) {
    if (resourceCache[url]) {
      /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
      return resourceCache[url];
    } else {
      /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
      const img = new Image();
      img.onload = function() {
        /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
        resourceCache[url] = img;

        /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
        if (isReady()) {
          readyCallbacks.forEach(function(func) {
            func();
          });
        }
      };

      /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
      resourceCache[url] = false;
      img.src = url;
    }
  }

  /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
  function get(url) {
    return resourceCache[url];
  }

  /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
  function isReady() {
    let ready = true;
    for (const k in resourceCache) {
      if (resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
        ready = false;
      }
    }
    return ready;
  }

  /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
  function onReady(func) {
    readyCallbacks.push(func);
  }

  /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
  window.Resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady,
  };
})();

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

/* global allEnemies player Resources */

(function(global) {
  /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
  const doc = global.document;

  const win = global.window;

  const canvas = doc.createElement('canvas');


  const ctx = canvas.getContext('2d');


  let lastTime;

  canvas.width = 1111;
  canvas.height = 686;
  doc.body.appendChild(canvas);

  /**
   * This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   * @return {void}
   */
  function main() {
    /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
    const now = Date.now();


    const dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
    win.requestAnimationFrame(main);
  }

  /** This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     * @return {void}
     */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  /** This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     * @param {int} dt The delta number.
     * @return {void}
     */
  function update(dt) {
    updateEntities(dt);
    // checkCollisions();
  }

  /** This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     * @param {int} dt The delta number.
     * @return {void}
     */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
  }

  /** This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     * @return {void}
     */
  function render() {
    /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
    const rowImages = [
      'images/water-block.png', // Top row is water
      'images/stone-block.png', // Row 1 of 3 of stone
      'images/stone-block.png', // Row 2 of 3 of stone
      'images/stone-block.png', // Row 3 of 3 of stone
      'images/stone-block.png', // Row 3 of 3 of stone
      'images/stone-block.png', // Row 3 of 3 of stone
      'images/grass-block.png', // Row 2 of 2 of grass
    ];


    const numRows = 7;


    const numCols = 11;


    let row; let col;

    // Before drawing, clear existing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  /** This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     *  @return {void}
     */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();
  }

  /** This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     * @return {void}
     */
  function reset() {
    // noop
  }

  /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
  global.ctx = ctx;
})(this);

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

//# sourceMappingURL=all.js.map
