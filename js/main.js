window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
      game.load.image('starfield', 'assets/brown.jpg');
    //game.load.image('starfield', 'assets/log.png');
      game.load.image('ball', 'assets/banana.png'); //sub for bananas
      game.load.image('coin', 'assets/insect.png'); //sub for flying monkey
      game.load.image( 'bambooscreen', 'assets/bcg1.jpg' ); //load background 
      game.load.audio('track','assets/track3.mp3');
    }
    
    var tilesprite;
    var cursors; 
    var balls; 
    var coin; 
    var coins;
    var bkgr; 
    var music;
    
    var score = 0;
    var score_text; 
    var gameOver; 
    
    var timer;
    var spawner; 
    
    
    function create() {
        music = game.sound.play('track'); //added music here
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.arcade.gravity.y = 60;
        
        bkgr = game.add.tileSprite(0, 0, 2000, 2000, 'bambooscreen'); 

        //ball = game.add.sprite(400, 0, 'ball');
        //tilesprite = game.add.tileSprite(300, 450, 200, 100, 'starfield');
        tilesprite = game.add.tileSprite(298,500, 120, 40, 'starfield');
         //tilesprite = game.add.tileSprite(300,500, 120, 140, 'starfield');

        //game.physics.enable([ ball, tilesprite ], Phaser.Physics.ARCADE);
        game.physics.arcade.enable(tilesprite);

        //ball.body.collideWorldBounds = true;
       // ball.body.bounce.set(1);

        tilesprite.body.collideWorldBounds = true;
        tilesprite.body.immovable = true;
        tilesprite.body.allowGravity = false;

        cursors = game.input.keyboard.createCursorKeys();
        
        //introduce the notion of a time limit.
        timer = game.time.create(false);
        //30 second timer
        timer.loop(Phaser.Timer.SECOND * 30, stopGame, this); //will kill timer once stopGame is called
        timer.start();
        
        //spawn random treats every half second -> 500 milliseconds
        spawner = game.time.create(false);
        spawner.loop(Phaser.Timer.SECOND * 0.5, spawnBalls, this);
        spawner.start();
        
        //  Finally some treats to eat
        balls = game.add.group();

        //  We will enable physics for any treat that is created in this group
        balls.enableBody = true;

        /*coins=game.add.group();
        coins.enableBody=true;
        for (i = 0; i < 2; i++)
        {
        //  Create a star inside of the 'stars' group
        var coin = coins.create(i * 150, 1, 'coin');
        coin.body.velocity.setTo(200,200);
        //coin.body.collideWorldBounds=true;
        coin.body.bounce.y = 0.7 + Math.random() * 0.2;
        coin.body.bounce.x=  0.7 + Math.random() * 0.2;
        }*/
        
        coin = game.add.sprite(400, 200, 'coin');
        //coin = game.add.sprite(400, 300, 'coin');
        game.physics.enable(coin, Phaser.Physics.ARCADE);
        coin.body.velocity.setTo(200, 200);
    
    //  This makes the game world bounce-able
    coin.body.collideWorldBounds = true;
    
    //  This sets the image bounce energy for the horizontal  and vertical vectors (as an x,y point). "1" is 100% energy return
    coin.body.bounce.set(1);

    coin.body.gravity.set(0, 180);
        
        
        //  The score
        score_text = game.add.text(16, 16, 
            'Score: ' + score, { fontSize: '32px', fill: '#9999ff' });
        
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 50, "Catch as much bananas as possible! Avoid the fly!", style );
        text.anchor.setTo( 0.5, 0.0 );
        
        
        
    }
    
    
    function collectBall (tilesprite, ball) {

        // Removes the star from the screen
        ball.kill();
        
        score = score + 10;
        score_text.text = "Score: " + score;
        }
    
        function enemyHitsPlayer (tilesprite,coins) {
        stateText.text=" You were eaten! GAME OVER \n Click to restart";
        stateText.visible = true;
            var text = game.add.text(350, 32, "Game Over", {fontSize: '32px', fill: '##9999ff'});
        game.input.onTap.addOnce(restart,this);
    }
    
    function update() {
          //game.physics.arcade.collide(balls, tilesprite);
          game.physics.arcade.overlap(tilesprite, balls, collectBall, null, this);
          game.physics.arcade.overlap(tilesprite, coin, enemyHitsPlayer, null, this);
          //game.physics.arcade.collide(tilesprite, coin);
          //game.physics.arcade.overlap(tilesprite,coin,explode,null,this);

        if (cursors.left.isDown)
        {
          tilesprite.body.x -= 8;
          tilesprite.tilePosition.x -= 8;
        }
        else if (cursors.right.isDown)
        {
          tilesprite.body.x += 8;
          tilesprite.tilePosition.x += 8;
        }

        if (cursors.up.isDown)
        {
          tilesprite.tilePosition.y += 8;
        }
        else if (cursors.down.isDown)
        {
          tilesprite.tilePosition.y -= 8;
        }
       }
    
    
    //randomly spawns treats on a timer
    function spawnBalls() {
        var ball = balls.create((Math.random() * 700)+50, 0, 'ball'); //spawns a treat at a random location
        
        //format for the treat (its settings)
        //scale down the treats
        ball.scale.x -= 0.8;
        ball.scale.y -= 0.8;

        //  Let gravity do its thing
        ball.body.gravity.y = 250;
        //found a bug where treats that hit the ground didn't actually hit the ground and fell through
        ball.body.collideWorldBounds = true;

        //  This just gives each treat a slightly random bounce value
        ball.body.bounce.y = 0.7 + Math.random() * 0.3;
        
        //now give random x velocity
        var num = Math.random(); //if the random number generated is less than 0.5, then we move right
        var modifier = 0;
        if (num < 0.5)
            modifier = 1; //moves to the right direction
        else
            modifier = -1; //moves to the left direction
        
        ball.body.velocity.x = (Math.random() * 200 * modifier) + (100 * modifier); //random number between 100 <-> 300 || -300 <-> -100
    }
    
    
    //terminates the game
    function stopGame() {
        //stop the timer
        timer.stop();
        //reset game input
        game.input.reset();
        
        game.input.keyboard.enabled = false; //stop keyboard usage
        
        
        //add text to tell the player the game ended
        var text = game.add.text(350, 32, "Game Over", {fontSize: '32px', fill: '##9999ff'});

    }
    
    function render() {
        game.debug.text("Time Remaining: " + (timer.duration.toFixed(0) / Phaser.Timer.SECOND), 16, 72);
        game.debug.spriteInfo(coin, 32, 32);
    }
};
