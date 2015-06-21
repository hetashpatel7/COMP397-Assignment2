/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />

/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />




// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var stats: Stats;

var assets: createjs.LoadQueue;
var reel1: createjs.Bitmap;
var reel2: createjs.Bitmap;
var reel3: createjs.Bitmap;
var manifest = [
    { id: "background", src: "assets/images/slotMachine.png" },
    { id: "banana", src: "assets/images/bananaSymbol.png" },
    { id: "grapes", src: "assets/images/grapesSymbol.png" },
    { id: "cherry", src: "assets/images/cherrySymbol.png" },
    { id: "bell", src: "assets/images/bellSymbol.png" },
    { id: "seven", src: "assets/images/sevenSymbol.png" },
    { id: "orange", src: "assets/images/orangeSymbol.png" },
    { id: "blank", src: "assets/images/blankSymbol.png" },
    { id: "bar", src: "assets/images/barSymbol.png" },
   
    { id: "clicked", src: "assets/audio/door_close.wav" }
];

var atlas = {
    "images": ["assets/images/atlas.png"],
    "frames": [

        [2, 2, 64, 64],
        [2, 68, 64, 64],
        [2, 134, 64, 64],
        [200, 2, 49, 49],
        [200, 53, 49, 49],
        [200, 104, 49, 49],
        [68, 2, 64, 64],
        [134, 2, 64, 64],
        [68, 68, 64, 64],
        [134, 68, 64, 64],
        [134, 134, 49, 49],
        [68, 134, 64, 64],
        [185, 155, 49, 49]
    ],
    "animations": {

        "bananaSymbol": [0],
        "barSymbol": [1],
        "bellSymbol": [2],
        "betMaxButton": [3],
        "betOneButton": [4],
        "betTenButton": [5],
        "blankSymbol": [6],
        "cherrySymbol": [7],
        "grapesSymbol": [8],
        "orangeSymbol": [9],
        "resetButton": [10],
        "sevenSymbol": [11],
        "spinButton": [12]
    }
};


// Game Variables
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;
var spinButton: objects.Button;
var reset: objects.Button;
var betone: objects.Button;
var betten: objects.Button;
var betmax: objects.Button;
var bet: objects.Label;
var credit: objects.Label;
var result: objects.Label;
var jackpotLabel: objects.Label;

/* Tally Variables */
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var fruits = "";
var winRatio = 0;
var grapes = 0;
var bananas = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;
var determinewin = 0;
var playerMoneyTemp = 1000;

var spinResult;

// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this); 
    assets.loadManifest(manifest);

    // Load Texture Atlas
    textureAtlas = new createjs.SpriteSheet(atlas);

    //Setup statistics object
    setupStats();
}

// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop); 

    // calling main game function
    main();
}

// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps

    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';

    document.body.appendChild(stats.domElement);
}


// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring

    stage.update();

    stats.end(); // end measuring
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "Blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "Grapes";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "Banana";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "Orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "Cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "Bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "Bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "Seven";
                sevens++;
                break;
        }
    }
    return betLine;
}

function resetAll()
{
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 0;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
    playerMoneyTemp = 1000;
    stage.removeChild(result);

}
//display loss message+++++++++++
function showLossMessage() {
  // alert("Hard Luck! Try Again...");
   stage.removeChild(result);
   
    result = new objects.Label("Lost!! ", 247, 303, false,"red");
    stage.addChild(result);
    showPlayerStats();
    resetFruitTally();
   
}

//display winning result in label+++++++++
function showWinMessage() {
    stage.removeChild(result);
    playerMoney += winnings;
    playerMoneyTemp = playerMoney;
    result = new objects.Label("$ " + winnings, 247, 303, false,"red");
    stage.addChild(result);
   // alert("You Won: $" + winnings);
    resetFruitTally();
    showPlayerStats();
    checkJackPot();


}

function resetFruitTally() {
    grapes = 0;
    bananas = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}

//function to check jackpot value++++++++++++
function checkJackPot() {
    /* compare two random values */
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        jackpotLabel = new objects.Label("$ "+jackpot,145,96,false,"red");
        alert("Hurray!!You Won the $" + jackpot + " Jackpot!!");
        playerMoney += jackpot;
        jackpot = 1000;
    }
}
//function to determine win or loss+++++++++
function determineWinnings() {
    console.log("fuction called");
    if (blanks == 0) {
        console.log("fuction called win");
        if (grapes == 3) {
            winnings = playerBet * 10;
        }
        else if (bananas == 3) {
            winnings = playerBet * 20;
        }
        else if (oranges == 3) {
            winnings = playerBet * 30;
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
        }
        else if (bars == 3) {
            winnings = playerBet * 50;
        }
        else if (bells == 3) {
            winnings = playerBet * 75;
        }
        else if (sevens == 3) {
            winnings = playerBet * 100;
        }
        else if (grapes == 2) {
            winnings = playerBet * 2;
        }
        else if (bananas == 2) {
            winnings = playerBet * 2;
        }
        else if (oranges == 2) {
            winnings = playerBet * 3;
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
        }
        else if (bars == 2) {
            winnings = playerBet * 5;
        }
        else if (bells == 2) {
            winnings = playerBet * 10;
        }
        else if (sevens == 2) {
            winnings = playerBet * 20;
        }
        else if (sevens == 1) {
            winnings = playerBet * 5;
        }
        else {
            winnings = playerBet * 1;
        }
        winNumber++;
       // console.log("winnings +++" + winnings);
         showWinMessage();
    }
    else {
        lossNumber++;
        //console.log("fuction called loss");
         showLossMessage();
    }
   // playerMoneyTemp = playerMoneyTemp + winnings;
}




// Callback function that allows me to respond to button click events
function spinButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");

    if (playerMoney == 0) {

        if (confirm("You ran out of Money! \nDo you want to play again?")) {
            resetAll();
        }

    } else if (playerBet > playerMoney) {

        alert("You don't have enough Money to place that bet.");

    }

    else if (playerBet == 0)
        alert("You have to bet some money to play...");
    else if (playerBet <= playerMoney) {
        playerMoney = playerMoney - playerBet;
        playerMoneyTemp = playerMoney;
        spinResult = Reels();
          switch (spinResult[0]) {
            case "Banana":
                reel1 = new createjs.Bitmap(assets.getResult("banana"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Grapes":
                reel1 = new createjs.Bitmap(assets.getResult("grapes"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Orange":
                reel1 = new createjs.Bitmap(assets.getResult("orange"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Cherry":
                reel1 = new createjs.Bitmap(assets.getResult("cherry"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Bar":
                reel1 = new createjs.Bitmap(assets.getResult("bar"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Seven":
                reel1 = new createjs.Bitmap(assets.getResult("seven"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Bell":
                reel1 = new createjs.Bitmap(assets.getResult("bell"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;

            case "Blank":
                reel1 = new createjs.Bitmap(assets.getResult("blank"));
                reel1.x = 53;
                reel1.y = 180;
                stage.addChild(reel1);
                break;


        }

        switch (spinResult[1]) {
            case "Banana":
                reel1 = new createjs.Bitmap(assets.getResult("banana"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Grapes":
                reel1 = new createjs.Bitmap(assets.getResult("grapes"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Orange":
                reel1 = new createjs.Bitmap(assets.getResult("orange"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Cherry":
                reel1 = new createjs.Bitmap(assets.getResult("cherry"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Bar":
                reel1 = new createjs.Bitmap(assets.getResult("bar"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Seven":
                reel1 = new createjs.Bitmap(assets.getResult("seven"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Blank":
                reel1 = new createjs.Bitmap(assets.getResult("blank"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Bell":
                reel1 = new createjs.Bitmap(assets.getResult("bell"));
                reel1.x = 129;
                reel1.y = 180;
                stage.addChild(reel1);
                break;


        }
        switch (spinResult[2]) {
            case "Banana":
                reel1 = new createjs.Bitmap(assets.getResult("banana"));
                reel1.x = 204;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Grapes":
                reel1 = new createjs.Bitmap(assets.getResult("grapes"));
                reel1.x = 204;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Orange":
                reel1 = new createjs.Bitmap(assets.getResult("orange"));
                reel1.x = 204;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Cherry":
                reel1 = new createjs.Bitmap(assets.getResult("cherry"));
                reel1.x = 204;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Bar":
                reel1 = new createjs.Bitmap(assets.getResult("bar"));
                reel1.x = 204;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Seven":
                reel1 = new createjs.Bitmap(assets.getResult("seven"));
                reel1.x = 204;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Blank":
                reel1 = new createjs.Bitmap(assets.getResult("blank"));
                reel1.x = 204;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
            case "Bell":
                reel1 = new createjs.Bitmap(assets.getResult("bell"));
                reel1.x = 204;
                reel1.y = 180;
                stage.addChild(reel1);
                break;
             


        }
        determineWinnings();
        showPlayerStats();
     
       //   result = new objects.Label("" + , 145, 303, false); 
    }
   
        
      

}
//show player stats in textboxes++++++++++
function showPlayerStats()
{
    stage.removeChild(bet);
    stage.removeChild(credit);
    bet = new objects.Label("" + playerBet, 145, 303, false,"black");
    stage.addChild(bet);
    credit = new objects.Label("" + playerMoneyTemp, 41, 303, false,"black");
    stage.addChild(credit);  
  
  
}
//reset all stats+++++++++++++++++
function resetButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
   
    resetAll();
    showPlayerStats();
}
//button to bet one dollar+++++++++++
function betOneButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");

   

    if (playerMoney >= 1)
    {
        playerBet = 1
        playerMoneyTemp = playerMoney - 1;
    }
    else
        alert("You don't have enough money to place that bet");
    showPlayerStats();
}
//button to bet maximum dollars you have+++++++++++
function betMaxButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");

    if (playerMoney != 0)
    {
        playerBet = playerMoney;
        playerMoneyTemp = 0;
    }
    else {
        if (confirm("You ran out of Money! \nDo you want to play again?")) {
            resetAll();
        }


    }
    showPlayerStats();
}
//button to bet ten dollars+++++++++++
function betTenButtonClicked(event: createjs.MouseEvent) {
   
    createjs.Sound.play("clicked");
   

    if (playerMoney >= 10)
    {
        playerBet = 10;
        playerMoneyTemp = playerMoney - 10;
    }

    else
        alert("You don't have enough money to place that bet");
    showPlayerStats();
}

// Callback functions that change the alpha transparency of the button



// Our Main Game Function
function main() {
    // add in slot machine graphic
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);

    // add spinButton sprite
    spinButton = new objects.Button("spinButton", 260, 334, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);

    reset = new objects.Button("resetButton", 16,334, false);
    stage.addChild(reset);
    reset.on("click", resetButtonClicked, this);

    betone = new objects.Button("betOneButton", 75, 334, false);
    stage.addChild(betone);
    betone.on("click", betOneButtonClicked, this);

    betten = new objects.Button("betTenButton", 135, 334, false);
    stage.addChild(betten);
    betten.on("click", betTenButtonClicked, this);

    betmax = new objects.Button("betMaxButton", 196, 334, false);
    stage.addChild(betmax);
    betmax.on("click", betMaxButtonClicked, this);
    showPlayerStats();
    
}