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

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 707;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        if(!playerSelect)
            update(dt);
        render();


        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Used the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */

        if (!paused)
        {    
            win.requestAnimationFrame(main);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. This function is called every
     * game tick (or loop of the game engine).
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        
        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

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
        if (gameOver === true){ renderGamerOver(); } 
        else if(playerSelect) { renderPlayerSelect(); }
        else
        {
            renderEntities();
            renderScore();
            renderLifeRemaining();
            if(paused){ renderPaused(); }
            else{ renderHowToPause(); }
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
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

    /* This function renders Player's Score */
    function renderScore() {
        ctx.font = '20pt Roboto';
        ctx.fillStyle = 'Yellow';
        ctx.fillText("Score: " + score, 50,100);
    }

    /* This functions renders Lives remaining */
    function renderLifeRemaining() {
        ctx.drawImage(Resources.get('images/Heart-mini.png'), 370, 552);
        ctx.font = '18pt Roboto';
        ctx.fillStyle = 'white';
        ctx.fillText(" x  " + life, 400, 575);
    }

    /* This functions renders 'Press P to pause' */
    function renderHowToPause() {
        ctx.textAlign = 'left';
        ctx.font = '14pt Roboto';
        ctx.fillStyle = 'White';
        ctx.textAlign = 'Right';
        ctx.fillText("Press P to pause", 20, 572);
    }

    /* This function renders Paused screen */
    function renderPaused() {
        ctx.globalAlpha = 0.65;
        ctx.fillStyle = 'black';
        ctx.fillRect(155, 303, 200, 100);
        ctx.globalAlpha = 1;

        ctx.font = '28pt Roboto';
        ctx.fillStyle = 'white';
        ctx.textAlign='center';
        ctx.fillText('Paused', canvas.width /2, 363);
        ctx.strokeStyle = 'white';
        ctx.strokeText('Paused', canvas.width /2, 363);
    }

    /* This function renders Game Over screen */
    function renderGamerOver() {
        convertToBW();
        ctx.font = '30pt Roboto';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';
        ctx.fillText('Your Score was ' + score, canvas.width /2, 230);
        ctx.font = '24pt Roboto';
        ctx.fillStyle = 'yellow';
        ctx.fillText('GAME OVER!', canvas.width /2, 290);
        ctx.font = '18pt Roboto';
        ctx.fillStyle = 'white';
        ctx.fillText('Press Enter to Play Again', canvas.width /2, 350);
    }
    /* This function renders Player Selection screen */
    function renderPlayerSelect(){
        var playerImages = [
            'images/char-boy.png', 
            'images/char-cat-girl.png',  
            'images/char-horn-girl.png', 
            'images/char-pink-girl.png', 
            'images/char-princess-girl.png'
        ];

        ctx.font = 'bold 24pt Roboto';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';
        ctx.fillText('Welcome',canvas.width /2, 120);

        ctx.font = 'bold 18pt Roboto';
        ctx.fillStyle = 'black';
        ctx.fillText('Use arrow keys to change Player', canvas.width /2 , 190);
        ctx.fillText("Press 'Enter' to Select", canvas.width /2, 220);

        ctx.drawImage(Resources.get('images/Star.png'), playerSelected * 101, 3 * 81);

        for (var col = 0; col < 5; col++) {

            ctx.drawImage(Resources.get(playerImages[col]), col * 101, 4 * 81);

        }
    }

    /* This function moves the selection star in Player Selection screen */
    function playerMarker(key) {
        if (key === 'right'){
            playerSelected += 1;
            (playerSelected > 4) ? playerSelected = 0 : playerSelected;
        } 
        else if (key === 'left')
        {
            playerSelected -= 1;
            (playerSelected < 0) ? playerSelected = 4 : playerSelected;
        }

        else if (key === 'Enter')
        {
            start();
            playerSelect = false;
        }
    }

    /* Converts the whole canvas to BW */
    function convertToBW(){
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var gray;
            for (var i = 0; i < data.length; i += 4) 
            {
                gray = convertToGray(data[i + 0], data[i + 1], data[i+2]);
                data[i + 0] = gray;
                data[i + 1] = gray;
                data[i+2] = gray;
            }
        ctx.putImageData(imageData, 0, 0);
    }

    /* This function coverts one pixel of canvas to gray */
    function convertToGray(r, g, b){
        return ( 0.299 * r + 0.587 * g + 0.114 *b ) / 3;
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // Empty
    }

    /* This loads all the images that we will need in this game. 
     * Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png', 
        'images/char-cat-girl.png',  
        'images/char-horn-girl.png', 
        'images/char-pink-girl.png', 
        'images/char-princess-girl.png',
        'images/Star.png',
        'images/Heart-mini.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable. */
    global.ctx = ctx;

    document.addEventListener('keydown', function(e) {

        // Listening for the Enter when game is over to restart it again
        if ((e.keyCode === 13) && (gameOver === true)) {
            gameOver = false;
            start();
        }

        // Unpauses the game hen P is pressed
        if (e.keyCode === 80 && paused)
        {   
            paused = false;
            lastTime = Date.now();
            win.requestAnimationFrame(main);
        }
        // Pauses the game when P is pressed
        else if (e.keyCode === 80)
        {
            if(!playerSelect)
                paused = true;

        }
    });

    // adding event listeners to the document for selscting player
    document.addEventListener('keydown', function(e) {
        var allowedKeys = {
            37: 'left',
            39: 'right',
            13: 'Enter'
        };
        if(playerSelect)
            playerMarker(allowedKeys[e.keyCode]);
    });
})(this);
