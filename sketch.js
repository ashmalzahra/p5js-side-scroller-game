var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft = false;
var isRight = false;
var isFalling = false;
var isPlummeting = false;
var isDead = false;
var gameOverPlayed = false;
var levelCompletePlayed = false;

var flagpole;
var lives;
var platforms;
var nextPlatformX;
var enemies;

//sound variables
var jumpSound;
var fall;
var collectItem;
var gameOver;
var levelComplete;
var enemyKill;
var bgSound;

// arrays for clouds, mountains, trees, canyons and collectables
var clouds = [];
var mountains = [];
var trees = [];
var canyons = [];
var collectables = [];
var confetti = []; //array to store confetti pieces

var cameraPosX = 0; // camera position for scrolling
var gameScore = 0;
var bobbingOffset = 0; // offset for collectable bobbing animation

function preload() {
    soundFormats('mp3', 'wav');

    bgSound = loadSound('assets/bg loop.wav');
    bgSound.setVolume(0.08);

    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);

    fall = loadSound('assets/falling down.wav');
    fall.setVolume(0.2);
    fall.playMode('untilDone'); //makes sure the sound won't start again if it's already playing


    collectItem = loadSound('assets/collect item.wav')
    collectItem.setVolume(0.1);

    gameOver = loadSound('assets/game over.wav')
    gameOver.setVolume(0.1);

    levelComplete = loadSound('assets/level complete.wav');
    levelComplete.setVolume(0.2);

    enemyKill = loadSound('assets/enemy kill.wav')
    enemyKill.setVolume(0.2);
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    floorPos_y = height * 3 / 4;
    lives = 3;

    bgSound.loop();

    startGame();
}


function startGame() {
    isPlummeting = false;
    isFalling = false;

    gameChar_x = width / 2;
    gameChar_y = floorPos_y;


    //initialize cloud objects
    clouds = [
        { x: 150, y: 100, size: 50 },
        { x: 400, y: 150, size: 70 },
        { x: 700, y: 120, size: 60 },
        { x: 1200, y: 130, size: 80 }
    ];

    //initialize mountain objects
    mountains = [
        { x: 200, y: floorPos_y, width: 120, height: 200 },
        { x: 600, y: floorPos_y, width: 150, height: 250 },
        { x: 1000, y: floorPos_y, width: 200, height: 300 }
    ];

    //initialize tree x-positions
    trees = [100, 300, 500, 700, 900, 1200, 1400];

    //initialize canyons
    canyons = [{ x_pos: 800, width: 100 }];

    //initialize collectables
    collectables = [
        { x_pos: 300, y_pos: floorPos_y - 50, size: random(40, 40), isFound: false },
        { x_pos: 500, y_pos: floorPos_y - 50, size: random(40, 40), isFound: false },
        { x_pos: 800, y_pos: floorPos_y - 50, size: random(40, 40), isFound: false },
        { x_pos: 1100, y_pos: floorPos_y - 50, size: random(40, 40), isFound: false }
    ];

    //initialize flagpole
    flagpole = { isReached: false, x_pos: 4000 };

    //create platforms at random
    platforms = [];
    let lastX = -500;
    let platformCount = int(random(3, 6));

    for (let i = 0; i < platformCount; i++) {
        let x = lastX + random(800, 1500);
        let y = random(floorPos_y - 150, floorPos_y - 80);  //lower platforms
        platforms.push(createPlatforms(x, y, 120));
        lastX = x;
    }

    //create enemies at random
    enemies = [];
    let enemyStartX = 1000;
    let enemySpacing = 800; //enemies spaced 800px apart

    for (let i = 0; i < 5; i++) {
        enemies.push(new createEnemy(
            enemyStartX + (i * enemySpacing) + random(-200, 200), //base position + random offset
            floorPos_y - 10,
            100
        ));
    }
}

function draw() {
    // backdrop
    background(242, 192, 250); //sky
    //grass gradient
    for (let y = floorPos_y; y < height; y++) {
        let greenShade = map(y, floorPos_y, height, 120, 83);
        fill(88, greenShade, 75);
        rect(0, y, width, 1);
    }

    //update camera position
    cameraPosX = gameChar_x - width / 2;
    push();
    translate(-cameraPosX, 0);

    //functions to draw objects
    drawTrees();
    drawMountains();
    drawClouds();
    drawFlagpole();

    //canyons
    for (var i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

    //collectables
    bobbingOffset = sin(frameCount * 0.1) * 5; //oscillates between -5 and 5
    for (var i = 0; i < collectables.length; i++) {
        if (!collectables[i].isFound) {
            drawCollectables(collectables[i])
        }
        checkCollectable(collectables[i]);
    }

    //platforms
    for (var i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }

    //enemies
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();

        if (lives >= 1 && !flagpole.isReached) {
            var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
            if (isContact) {
                lives -= 1;
                startGame();
                break;
            }
        }
    }

    drawCharacter();
    checkPlayerDie();

    pop();

    //display score
    fill(0);
    textSize(28);
    textFont('Courier New');
    textAlign(LEFT);

    text("Score: " + gameScore, 20, 30);

    //gravity and movement
    if (gameChar_y < floorPos_y && !isPlummeting) {

        var isContact = false;
        for (var i = 0; i < platforms.length; i++) {
            if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
                isContact = true;
                break;
            }
        }
        if (isContact == false) {
            gameChar_y += 2;
            isFalling = true;
        } else {
            isFalling = false; //isFalling to false when on a platform
        }
    } else {
        isFalling = false;
    }

    //display lives
    for (let i = 0; i < lives; i++) {
        fill(0);
        textSize(15);
        textFont('Courier New');

        text("Lives:", width - 160, 35)
        fill(255, 114, 114);
        noStroke();
        ellipse(width - 30 - i * 30, 30, 20, 20);  //simple circles as tokens of life
    }

    // update character position based on movement
    if (isLeft) gameChar_x -= 5;
    if (isRight) gameChar_x += 5;

    //check flagpole for state change
    if (flagpole.isReached == false) {
        checkFlagpole();
    }

    //game over state
    if (lives < 1) {
        //stop the fall sound from playing again
        if (fall.isPlaying()) {
            fall.stop();
        }
        if (bgSound.isPlaying()) {
            bgSound.stop();
        }

        push();
        textAlign(CENTER, CENTER);
        textSize(60);
        //text shadow
        fill(0, 150);
        text("GAME OVER", width / 2 + 5, height / 2 + 5);
        //main text
        let offsetX = random(-1, 1);
        let offsetY = random(-2, 2);
        fill(255, 0, 0);
        text("GAME OVER", width / 2 + offsetX, height / 2 + offsetY);
        //subtext
        textSize(20);
        fill(255);
        text("Press refresh to restart", width / 2, height / 2 + 50);
        pop();
        if (!gameOverPlayed) {
            gameOver.play();
            gameOverPlayed = true;
        }
        pop();
        return; //skip further game logic
    }

    //level complete state
    if (flagpole.isReached) {
        //initialize confetti if not already done
        if (confetti.length === 0) {
            makeConfetti();
        }
        //update and draw confetti
        drawConfetti();

        push();
        textAlign(CENTER, CENTER);
        textSize(60);
        let offsetX = random(-2, 2); //small text shaky effect
        let offsetY = random(-2, 2);
        fill(255, 215, 0); //main text
        text("LEVEL COMPLETE", width / 2 + offsetX, height / 2 + offsetY);
        //gradient effect:
        fill(255, 255, 150);
        text("LEVEL COMPLETE", width / 2 - 2 + offsetX, height / 2 - 2 + offsetY);
        fill(200, 160, 0);
        text("LEVEL COMPLETE", width / 2 + 2 + offsetX, height / 2 + 2 + offsetY);
        if (!levelCompletePlayed) {
            levelComplete.play();
            levelCompletePlayed = true;
        }
        pop();
        return; //skip further game logic
    }

    // generate new objects
    generateTrees();
    generateMountains();
    generateCanyons();
    generateCollectables();
    generateClouds();
    generatePlatforms();
}

//draw clouds
function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {
        noStroke(); //no outer stroke
        //cloud graphics and animation
        let alpha = map(sin(frameCount * 0.1), -1, 1, 50, 150);
        fill(230, 230, 250, alpha); //white with pulsating alpha
        ellipse(clouds[i].x, clouds[i].y, clouds[i].size, clouds[i].size);
        ellipse(clouds[i].x - clouds[i].size * 0.5, clouds[i].y, clouds[i].size * 0.8, clouds[i].size * 0.8);
        ellipse(clouds[i].x + clouds[i].size * 0.5, clouds[i].y, clouds[i].size * 0.8, clouds[i].size * 0.8);
    }
}

//draw mountains
function drawMountains() {
    for (var i = 0; i < mountains.length; i++) {
        fill(147, 112, 219);
        triangle(
            mountains[i].x - 35,
            mountains[i].y,
            mountains[i].x + mountains[i].width / 2,
            mountains[i].y - mountains[i].height,
            mountains[i].x + mountains[i].width + 30,
            mountains[i].y);

        fill(216, 191, 216);
        triangle(
            mountains[i].x,
            mountains[i].y,
            mountains[i].x + mountains[i].width,
            mountains[i].y - mountains[i].height,
            mountains[i].x + mountains[i].width * 2,
            mountains[i].y);
    }
}

//draw trees
function drawTrees() {
    for (var i = 0; i < trees.length; i++) {
        fill(74, 53, 43);
        rect(trees[i] - 10, floorPos_y - 160, 14, 160);

        //foliage with depth
        var foliageColor = i % 2 === 0 ?
            color(176, 203, 155) : //sage tree
            color(196, 123, 59); //orange tree
        fill(foliageColor);
        ellipse(trees[i], floorPos_y - 120, 125, 120);
        //highlight details
        fill(red(foliageColor) + 20, green(foliageColor) + 20, blue(foliageColor) + 20);
        ellipse(trees[i] + 10, floorPos_y - 130, 80, 90);
    }
}

//draw canyons
function drawCanyon(t_canyon) {
    let steps = 100;
    for (let y = floorPos_y; y < height; y++) {
        let greenShade = map(y, floorPos_y, height, 92, 60);
        fill(68, greenShade, 60);
        rect(t_canyon.x_pos, y, t_canyon.width, 1);
    }
}


//draw collectables
function drawCollectables(t_collectable) {
    fill(255, 215, 0); // Coin color
    ellipse(
        t_collectable.x_pos,
        t_collectable.y_pos + bobbingOffset,
        t_collectable.size,
        t_collectable.size
    );

    fill(255);
    ellipse(t_collectable.x_pos - t_collectable.size / 8,
        t_collectable.y_pos - t_collectable.size / 8 + bobbingOffset,
        t_collectable.size / 5,
        t_collectable.size / 5);
}

//draw flagpole
function drawFlagpole() {
    push();
    stroke(100);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    noStroke();
    fill(255, 0, 0);
    triangle(
        flagpole.x_pos, floorPos_y - 50,
        flagpole.x_pos + 30, floorPos_y - 70,
        flagpole.x_pos, floorPos_y - 90
    );

    fill(255, 215, 0);
    ellipse(flagpole.x_pos, floorPos_y - 250, 15, 15);
    if (flagpole.isReached) {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
    }
    else {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }

    pop();
}

//draw character
function drawCharacter() {
    //character colors
    const skinColor = color(255, 220, 180);
    const shirtColor = color(78, 134, 196);
    const pantsColor = color(55, 70, 95);
    const eyeColor = color(30);

    if (isLeft && isFalling) {
        //jumping left
        fill(skinColor);
        ellipse(gameChar_x, gameChar_y - 30, 28, 28); //head

        //eyes
        fill(eyeColor);
        ellipse(gameChar_x - 8, gameChar_y - 32, 6, 6);
        ellipse(gameChar_x + 8, gameChar_y - 32, 6, 6);

        fill(shirtColor);
        rect(gameChar_x - 12, gameChar_y - 20, 24, 32, 8); //body

        //arms
        fill(shirtColor);
        rect(gameChar_x - 20, gameChar_y - 18, 8, 22, 4);
        rect(gameChar_x + 12, gameChar_y - 18, 8, 22, 4);

        fill(pantsColor);
        rect(gameChar_x - 14, gameChar_y, 8, 14, 3); //left leg
        rect(gameChar_x + 2, gameChar_y, 8, 14, 3); //right leg

    } else if (isRight && isFalling) {
        //jumping right
        fill(skinColor);
        ellipse(gameChar_x, gameChar_y - 30, 28, 28); //head

        //eyes
        fill(eyeColor);
        ellipse(gameChar_x - 8, gameChar_y - 32, 6, 6);
        ellipse(gameChar_x + 8, gameChar_y - 32, 6, 6);

        fill(shirtColor);
        rect(gameChar_x - 12, gameChar_y - 20, 24, 32, 8); //body

        //arms
        fill(shirtColor);
        rect(gameChar_x - 20, gameChar_y - 18, 8, 22, 4);
        rect(gameChar_x + 12, gameChar_y - 18, 8, 22, 4);

        fill(pantsColor);
        rect(gameChar_x - 8, gameChar_y, 8, 14, 3); //left leg
        rect(gameChar_x + 6, gameChar_y, 8, 14, 3); //right leg

    } else if (isLeft) {
        //walking left
        fill(skinColor);
        ellipse(gameChar_x, gameChar_y - 30, 28, 28); //head

        //eyes
        fill(eyeColor);
        ellipse(gameChar_x - 8, gameChar_y - 32, 6, 6);
        ellipse(gameChar_x + 8, gameChar_y - 32, 6, 6);

        fill(shirtColor);
        rect(gameChar_x - 12, gameChar_y - 20, 24, 32, 8); //body

        //arms
        fill(shirtColor);
        rect(gameChar_x - 20, gameChar_y - 15, 8, 22, 4);
        rect(gameChar_x + 12, gameChar_y - 15, 8, 22, 4);

        fill(pantsColor);
        rect(gameChar_x - 15, gameChar_y, 8, 18, 3); //left leg
        rect(gameChar_x - 1, gameChar_y, 8, 18, 3); //right leg

    } else if (isRight) {
        //walking right
        fill(skinColor);
        ellipse(gameChar_x, gameChar_y - 30, 28, 28); //head

        //eyes
        fill(eyeColor);
        ellipse(gameChar_x - 8, gameChar_y - 32, 6, 6);
        ellipse(gameChar_x + 8, gameChar_y - 32, 6, 6);

        fill(shirtColor);
        rect(gameChar_x - 12, gameChar_y - 20, 24, 32, 8); //body

        //arms
        fill(shirtColor);
        rect(gameChar_x - 20, gameChar_y - 15, 8, 22, 4);
        rect(gameChar_x + 12, gameChar_y - 15, 8, 22, 4);

        fill(pantsColor);
        rect(gameChar_x - 8, gameChar_y, 8, 18, 3); //left leg
        rect(gameChar_x + 6, gameChar_y, 8, 18, 3); //right leg

    } else if (isFalling || isPlummeting) {
        //jumping facing forward
        fill(skinColor);
        ellipse(gameChar_x, gameChar_y - 30, 28, 28); //head

        //eyes
        fill(eyeColor);
        ellipse(gameChar_x - 8, gameChar_y - 32, 6, 6);
        ellipse(gameChar_x + 8, gameChar_y - 32, 6, 6);

        fill(shirtColor);
        rect(gameChar_x - 12, gameChar_y - 20, 24, 32, 8); //body

        //arms
        fill(shirtColor);
        rect(gameChar_x - 20, gameChar_y - 15, 8, 22, 4);
        rect(gameChar_x + 12, gameChar_y - 15, 8, 22, 4);

        fill(pantsColor);
        rect(gameChar_x - 12, gameChar_y, 8, 14, 3); //left leg
        rect(gameChar_x + 4, gameChar_y, 8, 14, 3); //right leg

    } else {
        //standing front facing
        fill(skinColor);
        ellipse(gameChar_x, gameChar_y - 30, 28, 28); //head

        //eyes
        fill(eyeColor);
        ellipse(gameChar_x - 8, gameChar_y - 32, 6, 6);
        ellipse(gameChar_x + 8, gameChar_y - 32, 6, 6);

        fill(shirtColor);
        rect(gameChar_x - 12, gameChar_y - 20, 24, 32, 8); //body

        //arms
        fill(shirtColor);
        rect(gameChar_x - 20, gameChar_y - 15, 8, 22, 4);
        rect(gameChar_x + 12, gameChar_y - 15, 8, 22, 4);

        fill(pantsColor);
        rect(gameChar_x - 10, gameChar_y, 8, 18, 3); //left leg
        rect(gameChar_x + 2, gameChar_y, 8, 18, 3); //right leg
    }

    //ground shadow
    fill(0, 30);
    noStroke();
    ellipse(gameChar_x, floorPos_y + 5, 35, 10);
}

//key functions
function keyPressed() {
    //unlock audio on first user interaction
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    //play bg sound as soon as game loads
    if (!bgSound.isPlaying()) {
        bgSound.loop();
    }

    //disable key actions if game over or level complete
    if (lives < 1 || flagpole.isReached) return;

    if (!isPlummeting) {
        if (key === 'a') {
            isLeft = true;
        }
        if (key === 'd') {
            isRight = true;
        }
        if (key === 'w' && !isFalling) {
            gameChar_y -= 150; //jump
            jumpSound.play();
        }
    }
}

function keyReleased() {
    if (key === 'a') isLeft = false;
    if (key === 'd') isRight = false;
}

//check if character falls in the canyon
function checkCanyon(t_canyon) {
    if (
        gameChar_x > t_canyon.x_pos &&
        gameChar_x < t_canyon.x_pos + t_canyon.width &&
        gameChar_y >= floorPos_y
    ) {
        isPlummeting = true;
        fall.play();
    }

    if (isPlummeting) {
        gameChar_y += 10;
        isLeft = isRight = false;
    }
}

//check if character collects the item
function checkCollectable(t_collectable) {
    if (
        !t_collectable.isFound &&
        //horizontal proximity
        abs(gameChar_x - t_collectable.x_pos) < 30 &&
        //vertical proximity (no need to jump)
        abs(gameChar_y - t_collectable.y_pos) < 30
    ) {
        t_collectable.isFound = true;
        collectItem.play();
        gameScore++;
    }
}

//check if a new level has been reached
function checkFlagpole() {
    var d = abs(gameChar_x - flagpole.x_pos);
    if (d < 10) {
        flagpole.isReached = true;
    }
}

//check if player fell in the canyon and lost all lives
function checkPlayerDie() {
    if (!isDead && gameChar_y > height) { //fallen below the canvas
        isDead = true;
        lives -= 1;
        if (fall.isPlaying()) {  //stop fall sound when life is lost
            fall.stop();
        }
        if (lives > 0) {
            setTimeout(function () {
                startGame();
                isDead = false; //reset the flag when the game restarts
            }, 500); //pause when the game restarts
        }
    }
}

//create new objects
//generate clouds
function generateClouds() {
    var cloudSpacing = 500;

    if (gameChar_x + cameraPosX > clouds[clouds.length - 1].x + cloudSpacing - 300) {
        var newCloud = {
            x: clouds[clouds.length - 1].x + cloudSpacing,
            y: random(50, 150),
            size: random(50, 80)
        };
        clouds.push(newCloud);
    }

    if (clouds[0].x < cameraPosX - width / 2 - 300) {
        clouds.shift();
    }
}

//generate mountains
function generateMountains() {
    var mountainSpacing = 400;

    if (gameChar_x + cameraPosX > mountains[mountains.length - 1].x + mountainSpacing - 300) {
        var newMountain = {
            x: mountains[mountains.length - 1].x + mountainSpacing,
            y: floorPos_y,
            width: random(100, 200),
            height: random(150, 300)
        };
        mountains.push(newMountain);
    }

    if (mountains[0].x < cameraPosX - width / 2 - 300) {
        mountains.shift();
    }
}

//generate trees
function generateTrees() {
    var treeSpacing = 300;

    if (gameChar_x + cameraPosX > trees[trees.length - 1] + treeSpacing - 300) {
        var newTreeX = trees[trees.length - 1] + treeSpacing;
        trees.push(newTreeX);
    }

    if (trees[0] < cameraPosX - width / 2 - 300) {
        trees.shift();
    }
}

//generate canyons
function generateCanyons() {
    var canyonSpacing = 500;

    //initial canyon position away from 0
    if (gameChar_x + cameraPosX > canyons[canyons.length - 1].x_pos + canyonSpacing - 300) {
        var newCanyon = {
            x_pos: canyons[canyons.length - 1].x_pos + canyonSpacing,
            width: random(50, 150)
        };
        canyons.push(newCanyon);
    }

    if (canyons[0].x_pos < cameraPosX - width / 2 - 300) {
        canyons.shift();
    }
}

//generate collectables
function generateCollectables() {
    var collectableSpacing = 300;

    if (gameChar_x + cameraPosX > collectables[collectables.length - 1].x_pos + collectableSpacing - 300) {
        var newCollectable = {
            x_pos: collectables[collectables.length - 1].x_pos + collectableSpacing,
            y_pos: floorPos_y - random(50, 100), //random height variation
            size: random(40, 40),
            isFound: false
        };
        collectables.push(newCollectable);
    }

    if (collectables[0].x_pos < cameraPosX - width / 2 - 300) {
        collectables.shift();
    }
}

//generate platforms
function generatePlatforms() {
    //when the player is near the next platform position, add a new platform.
    if (gameChar_x + cameraPosX > nextPlatformX - 300) {
        var newPlatform = createPlatforms(
            nextPlatformX,
            floorPos_y - random(50, 150), //random height offset for variation
            random(80, 150) //random platform length
        );
        platforms.push(newPlatform);
        //update nextPlatformX with a new random gap for the subsequent platform
        nextPlatformX += random(150, 300);
    }

    //remove platforms that are off-screen to the left
    if (platforms.length > 0 && platforms[0].x < cameraPosX - width / 2 - 300) {
        platforms.shift();
    }
}

//create platforms
function createPlatforms(x, y, length) {
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function () {
            //platform base with depth
            fill(94, 80, 75);
            rect(this.x, this.y, this.length, 20, 5);
            //platform details
            fill(115, 101, 96);
            rect(this.x + 2, this.y + 2, this.length - 4, 6, 2);
            //rivets
            fill(255, 215, 0);
            for (let i = 0; i < 3; i++) {
                ellipse(
                    this.x + (this.length / 4) + (i * this.length / 3),
                    this.y + 10,
                    6,
                    6
                );
            }
        },
        checkContact: function (charX, charY) {
            if (charX > this.x && charX < this.x +
                this.length) {
                var d = this.y - charY;
                if (d >= 0 && d < 5) {
                    return true;
                }
            }

            return false;
        }
    }
    return p;
}

//create enemies
function createEnemy(x, y, range) {
    this.x = x;
    this.y = y;
    this.range = 100;

    this.currentX = x;
    this.inc = 1;

    this.update = function () {
        this.currentX += this.inc;

        if (this.currentX >= this.x + this.range) {
            this.inc = -1;
        }
        else if (this.currentX < this.x) {
            this.inc = 1;
        }
    }

    this.draw = function () {
        this.update();
        //floating animation
        let floatY = this.y + sin(frameCount * 0.1) * 5;
        //ghost body
        fill(200);
        ellipse(this.currentX, floatY - 10, 40, 50); //main body
        rect(this.currentX - 20, floatY - 10, 40, 30, 20); //bottom waves
        //eyes
        fill(0);
        ellipse(this.currentX - 10, floatY - 15, 15, 20);
        ellipse(this.currentX + 10, floatY - 15, 15, 20);
        //angry eyebrows
        stroke(0);
        line(this.currentX - 15, floatY - 25, this.currentX - 5, floatY - 20);
        line(this.currentX + 5, floatY - 20, this.currentX + 15, floatY - 25);
    }

    this.checkContact = function (charX, charY) {
        var d = dist(charX, charY, this.currentX, this.y)

        if (d < 20) {
            enemyKill.play();
            return true;
        }
        return false;
    }
}

//create confetti for level complete
function makeConfetti() {
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: random(width),  //horizontal position
            y: random(-100, -50), //start above screen
            speed: random(2, 5),  //fall speed
            color: color(random(255), //random color
                random(255),
                random(255))
        });
    }
}

//update and draw confetti
function drawConfetti() {
    noStroke();
    for (let i = 0; i < confetti.length; i++) {
        //draw confetti piece
        fill(confetti[i].color);
        ellipse(confetti[i].x, confetti[i].y, 8, 8);
        //move downward
        confetti[i].y += confetti[i].speed;
        //reset position when off screen
        if (confetti[i].y > height) {
            confetti[i].y = random(-100, -50);
            confetti[i].x = random(width);
        }
    }
}