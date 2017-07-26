///<reference path="Place.ts"/>

class TheCave extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Last moves chosen
    private lastMoves: TheCaveMoveType[] = [];
    
    // Additional characters possible (that looks like imperfections in the rock)
    private additionalCharactersPossible: string[];
    
    // Positions where we can place additional characters
    private additionalCharactersPositionsPossible: Pos[];
    
    // Actual additional characters array that are added to the cave (they change each time we choose a new path)
    private additionalCharacters: TheCaveAdditionalCharacter[];
    
    // Database text names for the first sentence below
    private firstSentence: string = null;
    
    // Pattern currently in use
    private pattern: TheCavePattern = null;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Add the additional characters to the array
        this.createAdditionalCharactersPossible();
        
        // Add the additional characters positions to the array
        this.createAdditionalCharactersPositionsPossible();
        
        // Create the current way
        this.createWay();
        
        // Resize & update
        this.renderArea.resizeFromArray(Database.getAscii("places/theCave/ways"), 42, 7); // 3 for the return to map button + 4 for the two sentences = 7
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Public methods
    public aPatternNeedsUpdating(): void{
        this.update();
        this.getGame().updatePlace();
    }
    
    // Public getters
    public getAdditionalCharactersPositionsPossible(): Pos[]{
        return this.additionalCharactersPositionsPossible;
    }
    
    public getAdditionalCharactersPossible(): string[]{
        return this.additionalCharactersPossible;
    }
    
    // Private methods
    private createAdditionalCharactersPositionsPossible(): void{
        // Reset the array
        this.additionalCharactersPositionsPossible = [];
        
        // Add positions
        this.additionalCharactersPositionsPossible.push(new Pos(20, 6));
        this.additionalCharactersPositionsPossible.push(new Pos(19, 9));
        this.additionalCharactersPositionsPossible.push(new Pos(17, 13));
        this.additionalCharactersPositionsPossible.push(new Pos(20, 18));
        this.additionalCharactersPositionsPossible.push(new Pos(17, 24));
        this.additionalCharactersPositionsPossible.push(new Pos(41, 19));
        this.additionalCharactersPositionsPossible.push(new Pos(56, 16));
        this.additionalCharactersPositionsPossible.push(new Pos(52, 22));
        this.additionalCharactersPositionsPossible.push(new Pos(31, 23));
        this.additionalCharactersPositionsPossible.push(new Pos(64, 28));
        this.additionalCharactersPositionsPossible.push(new Pos(64, 12));
        this.additionalCharactersPositionsPossible.push(new Pos(75, 5));
        this.additionalCharactersPositionsPossible.push(new Pos(80, 12));
        this.additionalCharactersPositionsPossible.push(new Pos(77, 17));
        this.additionalCharactersPositionsPossible.push(new Pos(80, 20));
        this.additionalCharactersPositionsPossible.push(new Pos(78, 26));
    }
    
    private createAdditionalCharactersPossible(): void{
        // Reset the array
        this.additionalCharactersPossible = [];
        
        // Add characters
        this.additionalCharactersPossible.push("V");
        this.additionalCharactersPossible.push("\\");
        this.additionalCharactersPossible.push("/");
        this.additionalCharactersPossible.push("'");
        this.additionalCharactersPossible.push("`");
        this.additionalCharactersPossible.push("~");
        this.additionalCharactersPossible.push(")");
        this.additionalCharactersPossible.push("(");
        this.additionalCharactersPossible.push("}");
        this.additionalCharactersPossible.push("{");
        this.additionalCharactersPossible.push("@");
        this.additionalCharactersPossible.push(">");
        this.additionalCharactersPossible.push("^");
    }
    
    private createWay(moveType: TheCaveMoveType = null): void{
        // A variable used in the loop choosing the new pattern
        var cont: number;
        
        // Reset the additional characters array
        this.additionalCharacters = [];
        
        // Set the first sentence
        switch(moveType){
            case TheCaveMoveType.STRAIGHT: this.firstSentence = "theCaveFirstSentenceWentStraight"; break;
            case TheCaveMoveType.LEFT: this.firstSentence = "theCaveFirstSentenceWentLeft"; break;
            case TheCaveMoveType.RIGHT: this.firstSentence = "theCaveFirstSentenceWentRight"; break;
            case null: this.firstSentence = "theCaveFirstSentenceYouAre"; break;
        }
        
        // If there's a pattern, we possibly set it to null
        if(this.pattern != null){
            // If this pattern should end, there's no pattern anymore
            if(this.pattern.ended()){
                this.pattern = null;
            }
        }
        
        // If there's no pattern (and we moved at least once)
        if(this.pattern == null && this.lastMoves.length > 0){
            // One chance out of two to use a new one
            if(Random.flipACoin()){
                cont = 10;
                while(cont > 0 && this.pattern == null){
                    cont -= 1;
                    switch(Random.upTo(4)){
                        case 0:
                            if(Saving.loadBool("gridItemPossessedHeartPlug") == false)
                                this.pattern = new TheCavePattern_ArrowsToHeartPlug(this);
                        break;
                        case 1:
                            if(Saving.loadBool("TheCavePattern_ChocolateBarNowGotTheBar") == false)
                                this.pattern = new TheCavePattern_ChocolateBarNow(this);
                        break;
                        case 2:
                            if(Saving.loadBool("TheCavePattern_TreasureMapFoundTreasure") == false)
                                this.pattern = new TheCavePattern_TreasureMap(this);
                        break;
                        case 3:
                            this.pattern = new TheCavePattern_MonkeyWizard(this);
                        break;
                        case 4:
                            this.pattern = new TheCavePattern_OctopusKing(this);
                        break;
                    }
                }
            }
        }
        
        // Add some additional characters
        for(var i = 0; i < 10; i++){
            this.additionalCharacters.push(new TheCaveAdditionalCharacter(this));
        }
    }
    
    private drawWays(x: number = 0, y: number = 3): void{
        // Draw the background
        this.renderArea.drawArray(Database.getAscii("places/theCave/ways"), x+21, y);
        
        // Draw additional characters
        for(var i = 0; i < this.additionalCharacters.length; i++){
            this.renderArea.drawString(this.additionalCharacters[i].getString(), x+this.additionalCharacters[i].getPosition().x, y+this.additionalCharacters[i].getPosition().y);
        }
        
        // Draw the sentences
        if(this.firstSentence != null){
            this.renderArea.drawString(Database.getText(this.firstSentence), x+23, y+32);
            this.renderArea.drawString(Database.getTranslatedText(this.firstSentence), x+23, y+33, true);
        }
        if(this.pattern != null && this.pattern.getSentence() != null){
            this.renderArea.drawString(Database.getText(this.pattern.getSentence()), x+23, y+34);
            this.renderArea.drawString(Database.getTranslatedText(this.pattern.getSentence()), x+23, y+35, true);
        }
        
        // If there's a pattern, draw pattern related stuff
        if(this.pattern != null) this.pattern.draw(this.renderArea, x, y);
        
        // Add the black background color
        for(var i = 0; i <= 4; i++){
            this.renderArea.addBackgroundColor(x + 46, x + 54, y+1+i, new Color(ColorType.THECAVE_BACKGROUND_COLOR));
        }
        
        // Add the button to go left
        this.renderArea.addMultipleAsciiButtons("theCaveGoLeftButton",
            x+30, x+32, y+5,
            x+29, x+33, y+6,
            x+27, x+33, y+7,
            x+26, x+32, y+8,
            x+26, x+32, y+9,
            x+26, x+32, y+10,
            x+25, x+32, y+11,
            x+24, x+32, y+12,
            x+25, x+31, y+13,
            x+25, x+31, y+14,
            x+25, x+32, y+15,
            x+25, x+32, y+16,
            x+25, x+32, y+17,
            x+25, x+32, y+18,
            x+24, x+32, y+19,
            x+24, x+31, y+20,
            x+25, x+30, y+21,
            x+26, x+29, y+22,
            x+26, x+28, y+23,
            x+25, x+27, y+24,
            x+25, x+26, y+25
        );
        this.renderArea.addLinkCall(".theCaveGoLeftButton", new CallbackCollection(this.move.bind(this, TheCaveMoveType.LEFT)));
        
        // Add the button to go right
        this.renderArea.addMultipleAsciiButtons("theCaveGoRightButton",
            x+68, x+70, y+6,
            x+68, x+72, y+7,
            x+68, x+73, y+8,
            x+68, x+73, y+9,
            x+69, x+74, y+10,
            x+69, x+74, y+11,
            x+69, x+74, y+12,
            x+69, x+75, y+13,
            x+69, x+75, y+14,
            x+68, x+74, y+15,
            x+68, x+74, y+16,
            x+68, x+74, y+17,
            x+68, x+74, y+18,
            x+68, x+74, y+19,
            x+69, x+74, y+20,
            x+70, x+74, y+21,
            x+71, x+74, y+22,
            x+72, x+73, y+23
        );
        this.renderArea.addLinkCall(".theCaveGoRightButton", new CallbackCollection(this.move.bind(this, TheCaveMoveType.RIGHT)));
        
        // Add the button to go straight
        this.renderArea.addMultipleAsciiButtons("theCaveGoStraightButton",
            x+46, x+54, y+1,
            x+46, x+54, y+2,
            x+46, x+54, y+3,
            x+46, x+54, y+4,
            x+46, x+54, y+5
        );
        this.renderArea.addLinkCall(".theCaveGoStraightButton", new CallbackCollection(this.move.bind(this, TheCaveMoveType.STRAIGHT)));
    }
    
    private goToTheCaveExit(): void{
        Saving.saveBool("mainMapDoneCaveEntrance", true);
        this.getGame().setPlace(new TheCaveExit(this.getGame()));
    }
    
    private move(type: TheCaveMoveType): void{
        // If we made more than 12 moves and there's no pattern, we reach the exit
        if(this.lastMoves.length > 12 && this.pattern == null){
            this.goToTheCaveExit();
        }
        
        // If there's a pattern, we call its move method
        if(this.pattern != null) this.pattern.move(type);
        
        // Add this move to the last moves
        this.lastMoves.push(type);
        
        // Create the new way
        this.createWay(type);
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "theCaveBackToTheMapButton");
        
        // Draw the ways
        this.drawWays();
    }
}