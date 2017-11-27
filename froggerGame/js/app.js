var score;
var life;
var allEnemies;
var player;
var gameOver;
var paused;
var playerSelect = true;
var playerSelected = 0;

// Both Enamy and Player belong to the Character SuperClass
var Character = function(x,y){
    this.x = x;
    this.y = y;
}

/*Character.prototype.reset = function(x,y){
    console.log('here');
    this.x = x;
    this.y = y;
}*/

// Enemy Subclass
// Enemies our player must avoid
var Enemy = function(x, y) {
    Character.call(this, x, y);

    this.speed = getRandom();
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Updates the enemy's position, required method for game
Enemy.prototype.update = function(dt) {
    // Multiplied with delta time to make it run accross all computer
    // at same speed accross all computers
    if (this.x >= 505 || this.x < -101){
        this.speed = getRandom();
        this.x = -101;
    }
    else {
        this.x = this.x + (this.speed * dt);
    }
    if (this.y === player.y - 8)
    {
        if (this.x > player.x - 101 * 0.8 && this.x < player.x + 101 * 0.5)
        {
            // stops the animation for 0.5s when player hits enemy
            sleep(500); 

            //resets players position
            player.reset();

            // Calculates the remaining lives
            remainingLives();
        }
    }
};

// Draws the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player Subclass
var Player = function () {
    Character.call(this, 202, 405);
    this.sprite = this.playerSelection();
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

// Resets the player position when it reaches the water
Player.prototype.update = function(){
    if (this.y === - 10)
    {
        this.reset();
        score+=100;
    }   
}

// Used in playerSelection

Player.prototype.playerSelection = function(){
    var playerSprites = [
        'images/char-boy.png', 
        'images/char-cat-girl.png',  
        'images/char-horn-girl.png', 
        'images/char-pink-girl.png', 
        'images/char-princess-girl.png'
    ];
    return playerSprites[playerSelected];
}

// Used by the engine.js to render player on the map
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Handles the player movement
Player.prototype.handleInput = function(key){
 
    if (key === 'right'){
        if (this.x >= 101 * 4){ this.x = 404; }
        else{ this.x += 101; }
    } 
    else if (key === 'left')
    {
        if (this.x <= 0){ this.x = 0; }
        else{ this.x -= 101; }
    } 
    else if (key === 'up')
    {
        if (this.y <= -10){ this.y = -10; }
        else { this.y -= 83; }
    } 
    else if (key === 'down')
    {
        if (this.y >= 101 * 4){ this.y = 405; }
        else {this.y += 83; }
    }

}

// Resets the player position
Player.prototype.reset = function(){

    this.x = 202;
    this.y = 405;
}

// This is sort of init() of this file
// This is executed after the renderPlayerSelction
function start(){
    allEnemies = 
    [
        new Enemy(-101, 65),
        new Enemy(-101, 65 + 83),
        new Enemy(-101, 65 + 83 * 2)
    ];
    player = new Player();
    score = 0;
    life = 3;
    gameOver = false;
    paused = false;
};

// Calsulats the remaining lives
function remainingLives(){
    life--;
    if (life < 1) {
        gameReset();
    }
}

// Cahanges the gameOver flag
function gameReset() {
    gameOver = true;
}

// this is just a delay functiion
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// Generates random speed between 300 - 600
function getRandom() {
   return Math.floor(Math.random() * (600 - 300 + 1) + 300);
}

// Key listener. Used by player.handleInput()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'Enter'
    };
    if (!paused && !gameOver && !playerSelect) { 
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
