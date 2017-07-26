///<reference path="Place.ts"/>
///<reference path="Saving.ts"/>

Saving.registerNumber("aTreeStep", 0);

class ATree extends Place{
    // Render area
    private renderArea: RenderArea = new RenderArea();
    
    // Special tic-tac-toa variables
    private ticTacToeStep: ATreeTicTacToeStep = null;
    private ticTacToeBoard: ATreeTicTacToeSign[][] = null;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // If we're going to play tic tac toe
        if(Saving.loadNumber("aTreeStep") == 7){
            this.startTicTacToe();
        }
        
        // If we're at step 8 (just won the tic tac toe game), go on to step 9
        if(Saving.loadNumber("aTreeStep") == 8)
            this.nextStep();
        
        // Resize & update
        this.renderArea.resizeFromArray(Database.getAscii("places/aTree/background"), 17, 3);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private addEnigma(enigmaAnswer: EnigmaAnswer, callbackCollection: CallbackCollection, otherClass: string, wrongClass: string = "", wrongMessage: string = "Wrong"): void{
        this.renderArea.addEnigma(21, 41, 24, enigmaAnswer, callbackCollection, otherClass, wrongClass, wrongMessage);
    }
    
    private drawSpeech(normal: string, translated: string, x2: number = 59): void{
        this.renderArea.drawSpeech(normal, 4, 38, x2, "aTreeSpeech", translated);
    }
    
    private drawTicTacToeBoard(addButtons: boolean = true, x: number = 19, y: number = 23): void{
        // If the board isn't null
        if(this.ticTacToeBoard != null){
            // Draw the board background
            this.renderArea.drawArray(Database.getAscii("places/aTree/ticTacToeBoard"), x+7, y+5);
            
            // Iterate over the board to draw signs && add buttons
            for(var i = 0; i < 5; i++){
                for(var j = 0; j < 5; j++){
                    // Draw the sign or add the button, depending on the sign
                    switch(this.ticTacToeBoard[i][j]){
                        // There's already a sign : draw the sign
                        case ATreeTicTacToeSign.X:
                            this.renderArea.drawArray(Database.getAscii("places/aTree/ticTacToeX"), x+i*7+3, y+j*4+3);
                        break;
                        case ATreeTicTacToeSign.O:
                            this.renderArea.drawArray(Database.getAscii("places/aTree/ticTacToeO"), x+i*7+2, y+j*4+2);
                        break;
                        // There's no sign yet : draw the button
                        case ATreeTicTacToeSign.NO_SIGN:
                            if(addButtons){
                                // Iterate over the lines on which we need to add the buttons
                                for(var yButton = y+j*4+1; yButton <= y+j*4+4; yButton++){
                                    // If we're outside the board : add a ninja button
                                    if(i == 0 || i == 4 || j == 0 || j == 4){
                                        this.renderArea.addAsciiNinjaButton(x+i*7+1, x+i*7+7, yButton, "aTreeTicTacToeBoardButton" + i + "_" + j);
                                    }
                                    // Else, we're inside the board : add a regular button
                                    else{
                                        this.renderArea.addAsciiButton(x+i*7+1, x+i*7+7, yButton, "aTreeTicTacToeBoardButton" + i + "_" + j);
                                    }
                                }
                                // Add the link
                                this.renderArea.addLinkCall(".aTreeTicTacToeBoardButton" + i + "_" + j, new CallbackCollection(this.playTicTacToeSign.bind(this, i, j)));
                            }
                        break;
                    }
                }
            }
        }
    }
    
    private nextStep(): void{
        // We change the step
        Saving.saveNumber("aTreeStep", Saving.loadNumber("aTreeStep") + 1);
        
        // We possibly do some action depending on the new step
        if(Saving.loadNumber("aTreeStep") == 7){ // If we're going to play tic tac toe
            this.startTicTacToe();
        }
        if(Saving.loadNumber("aTreeStep") == 9){ // If we won the tic tac toe game
            this.getGame().gainItem("gridItemPossessedThirdHouseKey");
        }
        
        // We update
        this.update();
        this.getGame().updatePlace();
    }
    
    private playTicTacToe_copyBoard(board: ATreeTicTacToeSign[][]): ATreeTicTacToeSign[][]{
        // Create the new board
        var newBoard: ATreeTicTacToeSign[][] = [];
        
        // Copy the old one in the new one
        for(var i = 0; i < board.length; i++){
            newBoard.push(board[i].slice(0));
        }
        
        // Return the new board
        return newBoard;
    }
    
    private playTicTacToe_evaluateBoard(board: ATreeTicTacToeSign[][]): number{
        // The score
        var score: number = 0;
        
        // Evaluate all the lines
        score += this.playTicTacToe_evaluateLine(board, 1, 1, 2, 1, 3, 1);  // First column
        score += this.playTicTacToe_evaluateLine(board, 1, 2, 2, 2, 3, 2);  // Second column
        score += this.playTicTacToe_evaluateLine(board, 1, 3, 2, 3, 3, 3);  // Third column
        score += this.playTicTacToe_evaluateLine(board, 1, 1, 1, 2, 1, 3);  // First row
        score += this.playTicTacToe_evaluateLine(board, 2, 1, 2, 2, 2, 3);  // Second row
        score += this.playTicTacToe_evaluateLine(board, 3, 1, 3, 2, 3, 3);  // Third row
        score += this.playTicTacToe_evaluateLine(board, 1, 1, 2, 2, 3, 3);  // Diagonal
        score += this.playTicTacToe_evaluateLine(board, 1, 3, 2, 2, 3, 1);  // The other diagonal
        
        // Return the score
        return score;
    }
    
    private playTicTacToe_evaluateLine(board: ATreeTicTacToeSign[][], row1: number, col1: number, row2: number, col2: number, row3: number, col3: number): number{
        // The score
        var score: number = 0;
        
        // First cell
        if(board[row1][col1] == ATreeTicTacToeSign.O) // If the first cell is the squirrel
            score = 1;
        else if (board[row1][col1] == ATreeTicTacToeSign.X) // Else if it's the player
            score = -1;
    
        // Second cell
        if(board[row2][col2] == ATreeTicTacToeSign.O){ // If the second cell is the squirrel
            if(score == 1) // If the first cell was the squirrel
                score = 10;
            else if(score == -1) // Else, if the first cell was the player
                return 0;
            else // Else, the first cell was empty
                score = 1;
        }
        else if(board[row2][col2] == ATreeTicTacToeSign.X){ // If the second cell is the player
            if(score == 1) // If the first cell was the squirrel
                return 0;
            else if(score == -1) // Else, if the first cell was the player
                score = -10;
            else // Else, the first cell was empty
                score = -1;
        }
    
        // Third cell
        if(board[row3][col3] == ATreeTicTacToeSign.O){ // If the third cell is the squirrel
            if(score > 0) // If the first and/or the second cell is the squirrel
                score *= 10;
            else if(score < 0) // Else, if the first and/or the second cell is the player
                return 0;
            else // Else, the first and the second cells are empty
                score = 1;
        }
        else if(board[row3][col3] == ATreeTicTacToeSign.X){ // Else, if the third cell is the player
            if(score > 0) // If the first and/or the second cell is the squirrel
                return 0;
            else if(score < 0) // Else, if the first and/or the second cell is the player
                score *= 10;
            else // Else, the first and the second cells are empty
                score = -1;
        }

        // Return the score
        return score;
    }
    
    private playTicTacToe_minimax(board: ATreeTicTacToeSign[][], playerSign: ATreeTicTacToeSign, depth: number = 2): ATreeTicTacToeMinimaxReturnValue{
        // Variables
        var tempBoard: ATreeTicTacToeSign[][]; // The temp board, used to simulate moves
        var currentScore: number; // Current score, used for calculations
        var returnValue: ATreeTicTacToeMinimaxReturnValue = new ATreeTicTacToeMinimaxReturnValue; // The return value, which contains the best position and the best score
        var gameFull: boolean = true; // Used later to find out if the game is full or not
        
        // Set the initial best score, depending on the playerSign parameter
        if(playerSign == ATreeTicTacToeSign.O) // If the player sign is the squirrel
            returnValue.bestScore = -99999999;
        else // Else
            returnValue.bestScore = 99999999;
    
        // If the depth is > to 0 (this condition is needed to stop the iterating loop at some point)
        if(depth > 0){
            // Iterate over all the board
            for(var i = 1; i <= 3; i++){
                for(var j = 1; j <= 3; j++){
                    // If this cell is empty
                    if(board[i][j] == ATreeTicTacToeSign.NO_SIGN){
                        // We found at least one non-empty cell : the game isn't full
                        gameFull = false;
                        // Set the temp board from the real board
                        tempBoard = this.playTicTacToe_copyBoard(board);
                        // Try to play on this cell using the temp board
                        tempBoard[i][j] = playerSign;
                        if(playerSign == ATreeTicTacToeSign.O){  // If we're testing the squirrel
                            currentScore = this.playTicTacToe_minimax(tempBoard, ATreeTicTacToeSign.X, depth - 1).bestScore;
                            if(returnValue.bestScore <= currentScore){
                                returnValue.bestScore = currentScore;
                                returnValue.bestPosition = new Pos(i, j);
                            }
                        }
                        else{ // Else, we're testing the player
                            currentScore = this.playTicTacToe_minimax(tempBoard, ATreeTicTacToeSign.O, depth - 1).bestScore;
                            if(returnValue.bestScore >= currentScore){
                                returnValue.bestScore = currentScore;
                                returnValue.bestPosition = new Pos(i, j);
                            }
                        }
                    }
                }
            }
            // If the game seems full, we calculate the best score too
            if(gameFull) returnValue.bestScore = this.playTicTacToe_evaluateBoard(board);
        }
        else returnValue.bestScore = this.playTicTacToe_evaluateBoard(board);
        
        // Return the return value (best position found + the score)
        return returnValue;
    }
    
    private playTicTacToe_testEndGameConditions(): boolean{
        // Variables
        var shouldEnd: boolean = false;
        
        // Test if someone won (in the 5*5 grid)
        switch(this.playTicTacToe_testGameSomeoneWon()){
            case ATreeTicTacToeSign.O: // The squirrel won
                this.ticTacToeStep = ATreeTicTacToeStep.YOU_LOSE;
                return true;
            break;
            case ATreeTicTacToeSign.X: // The player won
                // add object to the player here
                this.nextStep();
                return true;
            break;
        }
        
        // Test if the game is full (in the 3*3 grid)
        if(this.playTicTacToe_testGameFull()){ // It's a draw
            this.ticTacToeStep = ATreeTicTacToeStep.NOBODY_WINS;
            return true;
        }
        
        // Nothing happens, we return false
        return false;
    }
    
    private playTicTacToe_testGameFull(): boolean{
        // Variables
        var isFull = true; // Will be set to false if there's any empty cell
        
        // Search for any empty cell
        for(var i = 1; i <= 3; i++){
            for(var j = 1; j <= 3; j++){
                if(this.ticTacToeBoard[i][j] == ATreeTicTacToeSign.NO_SIGN){
                    isFull = false;
                    break;
                }
            }
            if(isFull == false) break;
        }
        
        // If the board is full, return true
        if(isFull) return true;
        
        // Else, return false
        return false;
    }
    
    private playTicTacToe_testGameSomeoneWon(): ATreeTicTacToeSign{
        // Variables
        var returnSign: ATreeTicTacToeSign;
        
        for(var i = 0; i < 5; i++){
            returnSign = this.playTicTacToe_fiveInARow(i, 0, 0, 1);
            if(returnSign != null) return returnSign;
        }
    
        for(var i = 0; i < 5; i++){
            returnSign = this.playTicTacToe_fiveInARow(0, i, 1, 0);
            if(returnSign != null) return returnSign;
        }
        
        if((returnSign = this.playTicTacToe_fiveInARow(0, 0, 1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(0, 1, 1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(1, 0, 1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(0, 2, 1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(2, 0, 1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(4, 0, -1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(3, 1, -1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(3, 0, -1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(4, 2, -1, 1)) != null) return returnSign;
        if((returnSign = this.playTicTacToe_fiveInARow(2, 0, -1, 1)) != null) return returnSign;
        
        // No won won, we return NO_SIGN
        return ATreeTicTacToeSign.NO_SIGN;
    }
    
    private playTicTacToe_fiveInARow(x1: number, y1: number, x2: number, y2: number): ATreeTicTacToeSign{
        // Variables
        var column: number = x1;
        var row: number = y1;
        var counter: number = 0;
        var currentSign: ATreeTicTacToeSign = null;
     
        while(column >= 0 && column < 5 && row >= 0 && row < 5){
            if(this.ticTacToeBoard[column][row] != ATreeTicTacToeSign.NO_SIGN){
                if(this.ticTacToeBoard[column][row] != currentSign){
                    currentSign = this.ticTacToeBoard[column][row];
                    counter = 1;
                }
                else
                    counter++;
            }
            else counter = 0;
     
            if(currentSign != null && counter == 3)
                return currentSign;
     
            column += x2;
            row += y2;
        }
     
        return null;
    }
    
    private playTicTacToe_tryAgain(): void{
        this.startTicTacToe();
        this.update();
        this.getGame().updatePlace();
    }
    
    private playTicTacToeSign(xIndex: number, yIndex: number): void{
        // Add the sign
        this.ticTacToeBoard[xIndex][yIndex] = ATreeTicTacToeSign.X;
        
        // Test end game conditions (we only make the squirrel play if nothing happens)
        if(this.playTicTacToe_testEndGameConditions() == false){      
            // IA
            var bestPosition: Pos = this.playTicTacToe_minimax(this.ticTacToeBoard, ATreeTicTacToeSign.O).bestPosition;
            this.ticTacToeBoard[bestPosition.x][bestPosition.y] = ATreeTicTacToeSign.O;
            // Test end game conditions
            this.playTicTacToe_testEndGameConditions();
        }
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private reward1(): void{
        this.getGame().getCandies().add(20);
    }
    
    private reward2(): void{
        this.getGame().getCandies().add(100);
    }
    
    private reward3(): void{
        this.getGame().getCandies().add(500);
    }
    
    private reward4(): void{
        this.getGame().getLollipops().add(3);
    }
    
    private reward5(): void{
        this.getGame().getChocolateBars().add(3);
    }
    
    private startTicTacToe(): void{
        // Reset the array
        this.ticTacToeBoard = [];
        
        // Add the signs to the board
        for(var i = 0; i < 5; i++){
            this.ticTacToeBoard.push([]);
            for(var j = 0; j < 5; j++){
                this.ticTacToeBoard[i].push(ATreeTicTacToeSign.NO_SIGN);
            }
        }
        
        // Set the step
        this.ticTacToeStep = ATreeTicTacToeStep.PLAYING;
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "aTreeBackToTheMapButton");
        
        // Draw the tree with the squirrel
        this.renderArea.drawArray(Database.getAscii("places/aTree/background"), 0, 3);
        
        // Draw the speech
        switch(Saving.loadNumber("aTreeStep")){
            // Introduction speech
            case 0:
                this.drawSpeech(Database.getText("mapATreeIntroductionSpeech"), Database.getTranslatedText("mapATreeIntroductionSpeech"));
                this.renderArea.addAsciiRealButton(Database.getText("mapATreeIntroductionButton"), 21, 24, "aTreeIntroductionButton", Database.getTranslatedText("mapATreeIntroductionButton"));
                this.renderArea.addLinkCall(".aTreeIntroductionButton", new CallbackCollection(this.nextStep.bind(this)));
            break;
            // First question (do you like candies)
            case 1:
                this.drawSpeech(Database.getText("mapATreeFirstQuestion"), Database.getTranslatedText("mapATreeFirstQuestion"));
                this.addEnigma(new EnigmaAnswerStrings(["yes", "y", "yeah", "yeap", "yep"]), new CallbackCollection(this.nextStep.bind(this), this.reward1.bind(this)), "aTreeFirstQuestionEnigma", "aTreeFirstQuestionWrong");
            break;
            // Second question (S E I D N A ?)
            case 2:
                this.drawSpeech(Database.getText("mapATreeSecondQuestion"), Database.getTranslatedText("mapATreeSecondQuestion"));
                this.addEnigma(new EnigmaAnswerStrings(["c", "letterc", "theletterc"]), new CallbackCollection(this.nextStep.bind(this), this.reward2.bind(this)), "aTreeSecondQuestionEnigma", "aTreeSecondQuestionWrong");
            break;
            // Third question (how many candies does the candiest man in the world possess?)
            case 3:
                this.drawSpeech(Database.getText("mapATreeThirdQuestion"), Database.getTranslatedText("mapATreeThirdQuestion"));
                this.addEnigma(new EnigmaAnswerCandies(this.getGame()), new CallbackCollection(this.nextStep.bind(this), this.reward3.bind(this)), "aTreeThirdQuestionEnigma", "aTreeThirdQuestionWrong");
            break;
            // Fourth question (number of marks on the tree)
            case 4:
                this.drawSpeech(Database.getText("mapATreeFourthQuestion"), Database.getTranslatedText("mapATreeFourthQuestion"), 75);
                this.addEnigma(new EnigmaAnswerStrings(["10", "ten", "10marks", "tenmarks"]), new CallbackCollection(this.nextStep.bind(this), this.reward4.bind(this)), "aTreeFourthQuestionEnigma", "aTreeFourthQuestionWrong");
            break;
            // Fifth question (yellow hat in the red sea)
            case 5:
                this.drawSpeech(Database.getText("mapATreeFifthQuestion"), Database.getTranslatedText("mapATreeFifthQuestion"), 75);
                this.addEnigma(new EnigmaAnswerStrings(["wet", "itbecomeswet", "itbecomewet", "becomeswet", "becomewet", "itgetswet", "itgetwet", "itswet", "itgotwet", "itiswet", "itiswetnow", "itswetnow", "float", "floats", "itfloats", "itsfloating", "itisfloating", "floating", "itfloat"]), new CallbackCollection(this.nextStep.bind(this), this.reward5.bind(this)), "aTreeFifthQuestionEnigma", "aTreeFifthQuestionWrong");
            break;
            // Sixth question (tic-tac-toe) : intro speech
            case 6:
                // Draw the speech
                this.drawSpeech(Database.getText("mapATreeTicTacToeIntro"), Database.getTranslatedText("mapATreeTicTacToeIntro"), 75);
                // Add the button to go to the next step
                this.renderArea.addAsciiRealButton(Database.getText("mapATreeTicTacToeIntroButton"), 21, 24, "mapATreeTicTacToeIntroButton", Database.getTranslatedText("mapATreeTicTacToeIntroButton"));
                this.renderArea.addLinkCall(".mapATreeTicTacToeIntroButton", new CallbackCollection(this.nextStep.bind(this)));
            break;
            case 7: // Tic-tac-toe : let's play!
                // Draw different things depending on the tic-tac-toa step
                switch(this.ticTacToeStep){
                    case ATreeTicTacToeStep.PLAYING:
                        this.drawSpeech(Database.getText("mapATreeTicTacToeLetsPlay"), Database.getTranslatedText("mapATreeTicTacToeLetsPlay"), 75); // Speech
                        this.drawTicTacToeBoard(); // Board
                    break;
                    case ATreeTicTacToeStep.NOBODY_WINS:
                        this.drawSpeech(Database.getText("mapATreeTicTacToeNobodyWins"), Database.getTranslatedText("mapATreeTicTacToeNobodyWins"), 75); // Speech
                        this.drawTicTacToeBoard(false); // Board
                    break;
                    case ATreeTicTacToeStep.YOU_LOSE:
                        this.drawSpeech(Database.getText("mapATreeTicTacToeYouLose"), Database.getTranslatedText("mapATreeTicTacToeYouLose"), 75); // Speech
                        this.drawTicTacToeBoard(false); // Board
                    break;
                }
                // If was just had a draw / lose, add the button to try again
                if(this.ticTacToeStep == ATreeTicTacToeStep.NOBODY_WINS || this.ticTacToeStep == ATreeTicTacToeStep.YOU_LOSE){
                    this.renderArea.addAsciiRealButton(Database.getText("mapATreeTicTacToeTryAgainButton"), 21, 24, "mapATreeTicTacToeTryAgainButton", Database.getTranslatedText("mapATreeTicTacToeTryAgainButton"));
                    this.renderArea.addLinkCall(".mapATreeTicTacToeTryAgainButton", new CallbackCollection(this.playTicTacToe_tryAgain.bind(this)));
                }
            break;
            case 8:
                this.drawSpeech(Database.getText("mapATreeTicTacToeYouWin"), Database.getTranslatedText("mapATreeTicTacToeYouWin"), 75); // Speech
                this.drawTicTacToeBoard(false); // Board
                // Button
                this.renderArea.addAsciiRealButton(Database.getText("mapATreeTicTacToeAnymoreSweet"), 21, 24, "mapATreeTicTacToeAnymoreSweet", Database.getTranslatedText("mapATreeTicTacToeAnymoreSweet"), true);
                this.renderArea.addLinkCall(".mapATreeTicTacToeAnymoreSweet", new CallbackCollection(this.nextStep.bind(this)));
            break;
            case 9:
                this.drawSpeech(Database.getText("mapATreeNoMoreChallenge"), Database.getTranslatedText("mapATreeNoMoreChallenge"));
            break;
        }
            
    }
}