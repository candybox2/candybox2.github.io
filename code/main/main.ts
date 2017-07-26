///<reference path="Game.ts"/>
///<reference path="./../../libs/jquery.d.ts"/>

module Main{
    // The game
    var game: Game = null;
    
    // Information about loading
    var loadingType: MainLoadingType = MainLoadingType.NONE;
    var loadingString: string = null;
    
    // Information about the game mode
    var gameMode: string = null;

    // Public functions    
    export function documentIsReady(): void{
        Keyboard.execute(); // Execute the Kayboard jquery stuff
        start(); // Start the game
    }
    
    export function reloadEverythingFromFile(fileContent: string): void{
        // Clear intervals for the current game
        game.clearAllIntervals();
        // Set the loading type
        loadingType = MainLoadingType.FILE;
        // Set the loading string
        loadingString = fileContent;
        // Set the gamemode (null so that it is set from loading)
        gameMode = null;
        // We can't register anymore
        Saving.canRegister = false;
        // Finally start (this will erase the current game)
        start();
    }
    
    export function setUrlData(urlData: string): void{
        // Create some variables
        var beforeEqual: string;
        var afterEqual: string;
        
        // If there's something in the url and we can find an equal sign and this equal sign isn't the last character of the string
        if(urlData != "" && urlData.indexOf("=") != -1 && urlData.indexOf("=") < urlData.length-1){
            // Strip the question mark
            urlData = urlData.substr(1);
            // Separate the data in two parts : before and after the equal sign
            beforeEqual = urlData.substr(0, urlData.indexOf("="));
            afterEqual = urlData.substr(urlData.indexOf("=") + 1);
            // Do different things depending on the value of beforeEqual
            switch(beforeEqual){
                // If we're trying to load a local slot
                case "slot":
                    loadingType = MainLoadingType.LOCAL;
                    loadingString = "slot" + afterEqual;
                break;
                // If we're trying to launch a new game with a special mode
                case "gamemode":
                    gameMode = afterEqual;
                break;
            }
        }
    }
    
    function start(): void{
        game = new Game(gameMode);
        Keyboard.setGame(game);
        Saving.load(game, loadingType, loadingString);
        game.postLoad();
    }
}

$(document).ready(function(){
    Main.setUrlData(window.location.search);
    Main.documentIsReady();
});