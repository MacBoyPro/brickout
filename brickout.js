
BRICKOUT = {};
BRICKOUT.timerInterval = 1000 / 60000; //Update the display 60 times per second
BRICKOUT.timer = null;
BRICKOUT.xVector = 4;
BRICKOUT.yVector = 4;

BRICKOUT.ball = null;
BRICKOUT.ballCenter = {};

BRICKOUT.paddle = null;
BRICKOUT.paddleCenter = {};
BRICKOUT.paddleStep = 10;

BRICKOUT.bricks = [];
BRICKOUT.brickTypes = [];
BRICKOUT.brickWidth = 10;
BRICKOUT.brickHeight = 5;

BRICKOUT.score = 0;
BRICKOUT.movementTracker = 0;

BRICKOUT.startPlaying = function() {
    BRICKOUT.ball = $('div#ball');
    
    var currentBallOffset = BRICKOUT.ball.offset();
    var ballCurrentX = currentBallOffset.left;
    var ballCurrentY = currentBallOffset.top;
    
    BRICKOUT.ballCenter = { 'x': BRICKOUT.ball.width()/2 + ballCurrentX,
                            'y': BRICKOUT.ball.height()/2 + ballCurrentY };
                            
                            
    BRICKOUT.paddle = $('div#paddle');
    BRICKOUT.paddle.css('left', ($('div#container').width()/2) - BRICKOUT.paddle.width());
    
    var currentPaddleOffset = BRICKOUT.paddle.offset();
    var paddleCurrentX = currentPaddleOffset.left;
    var paddleCurrentY = currentPaddleOffset.top;
    
    BRICKOUT.paddleCenter = { 'x': BRICKOUT.paddle.width()/2 + paddleCurrentX,
                              'y': BRICKOUT.paddle.height()/2 + paddleCurrentY };                        
        
    $(document).keydown( function(e){
        switch(e.keyCode) {
                case 37: // left
                        BRICKOUT.movementTracker = -1;
                        break;
                case 39: // right
                        BRICKOUT.movementTracker = 1;
                        break;
        };
    });
    
    $(document).keyup( function(e){
        switch(e.keyCode) {
                case 37: // left
                        if (BRICKOUT.movementTracker == -1) 
                            BRICKOUT.movementTracker = 0; 
                        break;
                case 39: // right
                        if (BRICKOUT.movementTracker == 1)
                            BRICKOUT.movementTracker = 0; 
                        break;
        }
    });
    
    // choose whether the ball moves left or right to start with
    if(Math.floor(Math.random()*101) < 50)
        BRICKOUT.xVector = -BRICKOUT.xVector;
    
    BRICKOUT.initializeBricks();
    BRICKOUT.intializeTimer();
};

BRICKOUT.intializeTimer = function() {
    if(!BRICKOUT.timer)
        BRICKOUT.timer = setInterval(BRICKOUT.gameLogic, BRICKOUT.timerInterval);
};

BRICKOUT.abortTimer = function() {
    if(BRICKOUT.timer)
        clearInterval(BRICKOUT.timer);
};

BRICKOUT.initializeBricks = function() {
    BRICKOUT.brickTypes[0] = 'black';
    BRICKOUT.brickTypes[1] = 'orange';
    BRICKOUT.brickTypes[2] = 'green';
    BRICKOUT.brickTypes[3] = 'yellow';
    
    BRICKOUT.bricks = new Array(BRICKOUT.brickWidth);
    
    var count = 0;
    var x,y;
    
    for(x = 0; x < BRICKOUT.brickWidth; x++) {
        BRICKOUT.bricks[x] = new Array(BRICKOUT.brickHeight);
    }
    
    for(y = 0; y < BRICKOUT.brickHeight; y++) {
        for(x = 0; x < BRICKOUT.brickWidth; x++) {
            BRICKOUT.bricks[x][y] = document.createElement('div');
            BRICKOUT.bricks[x][y].className = "brick";
            BRICKOUT.bricks[x][y].style.backgroundColor = BRICKOUT.brickTypes[(count++ % BRICKOUT.brickTypes.length)];
            
            $('div#container').append(BRICKOUT.bricks[x][y]);
        }
    }
};

BRICKOUT.movePaddle = function(vector) {
    BRICKOUT.paddleCenter['x'] += vector;
};

BRICKOUT.processCollision = function(brick) {
    
    BRICKOUT.score += 10;

    if(BRICKOUT.xVector > 0 && $(brick).offset().left - BRICKOUT.ballCenter['x'] <= 4) {
        BRICKOUT.xVector = -BRICKOUT.xVector;
    } else if (BRICKOUT.xVector < 0 && BRICKOUT.ballCenter['x'] - ($(brick).offset().left + $(brick).width()) <= 4) {
        BRICKOUT.xVector = -BRICKOUT.xVector;
    }
    
    if(BRICKOUT.yVector > 0 && $(brick).offset().top - BRICKOUT.ballCenter['y'] <= 4) {
        BRICKOUT.yVector = -BRICKOUT.yVector;
    } else if (BRICKOUT.xVector < 0 && BRICKOUT.ballCenter['y'] - ($(brick).offset().top + $(brick).height()) <= 4) {
        BRICKOUT.yVector = -BRICKOUT.yVector;
    }
    
    $(brick).fadeTo(1,0);
};

BRICKOUT.intersect = function(elementOne,elementTwo) {
    var intersected = false;
    
    var elemOneOrigin = {'x': parseInt($(elementOne).offset().left),
                         'y': parseInt($(elementOne).offset().top), 
                         'width': $(elementOne).width(), 
                         'height': $(elementOne).height()};
                         
    var elemTwoOrigin = {'x': parseInt($(elementTwo).offset().left),
                         'y': parseInt($(elementTwo).offset().top), 
                         'width': $(elementTwo).width(), 
                         'height': $(elementTwo).height() };
      
      
      
    if(elemOneOrigin['x'] >= elemTwoOrigin['x'] && 
       elemOneOrigin['x'] <= (elemTwoOrigin['x']+elemTwoOrigin['width']) &&
       elemOneOrigin['y'] >= elemTwoOrigin['y'] && 
       elemOneOrigin['y'] <= (elemTwoOrigin['y']+elemTwoOrigin['height'])) {
        intersected = true;
    }
    
    if(elemTwoOrigin['x'] >= elemOneOrigin['x'] && 
       elemTwoOrigin['x'] <= (elemOneOrigin['x']+elemOneOrigin['width']) &&
       elemTwoOrigin['y'] >= elemOneOrigin['y'] && 
       elemTwoOrigin['y'] <= (elemOneOrigin['y']+elemOneOrigin['height'])) {
        intersected = true;
    }
    
    return intersected;
}

BRICKOUT.gameLogic = function() {

    var containerAtLeftBorder = BRICKOUT.paddleCenter['x'] - 32 <= 0;
    var containerAtRightBorder = BRICKOUT.paddleCenter['x'] + 32 >= $("div#container").width();

    if((BRICKOUT.movementTracker == -1 && containerAtLeftBorder != true) || 
      (BRICKOUT.movementTracker == 1 && containerAtRightBorder != true))
        BRICKOUT.movePaddle(BRICKOUT.movementTracker * BRICKOUT.paddleStep);
    
    
    var currentOffset = BRICKOUT.ball.offset();
    var currentX = currentOffset.left;
    var currentY = currentOffset.top;
    
    BRICKOUT.ballCenter['x'] += BRICKOUT.xVector;
    BRICKOUT.ballCenter['y'] += BRICKOUT.yVector;
   
    var paddleCollision = BRICKOUT.ballCenter['y'] >= BRICKOUT.paddleCenter['y'] - 16 &&
                          BRICKOUT.ballCenter['y'] <= BRICKOUT.paddleCenter['y'] + 16 &&
                          BRICKOUT.ballCenter['x'] >= BRICKOUT.paddleCenter['x'] - 32 &&
                          BRICKOUT.ballCenter['x'] <= BRICKOUT.paddleCenter['x'] + 32;
                          
          
    if(paddleCollision)
        BRICKOUT.yVector = -BRICKOUT.yVector;
    
    var x,y;
    for(y = 0; y < BRICKOUT.brickHeight; y++) {
        for(x = 0; x < BRICKOUT.brickWidth; x++) {
            if($(BRICKOUT.bricks[x][y]).css('opacity') > 0 && BRICKOUT.intersect(document.getElementById('ball'),BRICKOUT.bricks[x][y])) {
                BRICKOUT.processCollision(BRICKOUT.bricks[x][y]);
            }
        }
    }
    
    if(BRICKOUT.xVector > 0)
        currentX += BRICKOUT.ball.width();
        
    if(BRICKOUT.yVector > 0)
        currentY += BRICKOUT.ball.height();
        
    var containerX = $('div#container').offset().left;
    var containerY = $('div#container').offset().top;    
    var containerWidth = $('div#container').width();
    var containerHeight = $('div#container').height();
    
    if(currentX >= containerWidth || currentX <= containerX)
        BRICKOUT.xVector = -BRICKOUT.xVector;
    if(currentY >= containerHeight || currentY <= containerY)
        BRICKOUT.yVector = -BRICKOUT.yVector;    
    
    BRICKOUT.paddle.offset({left: BRICKOUT.paddleCenter['x'] - BRICKOUT.paddle.width()/2});
    
    var newXOffset = currentOffset.left + BRICKOUT.xVector;
    var newYOffset = currentOffset.top + BRICKOUT.yVector;
    BRICKOUT.ball.offset({left: newXOffset, top: newYOffset});
    
    $('div#score').html("Score: " + BRICKOUT.score);
};