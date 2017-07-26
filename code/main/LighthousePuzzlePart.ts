class LighthousePuzzlePart{
    // The lighthouse
    private lighthouse: Lighthouse;
    
    // The type
    private type: LighthousePuzzlePartType;
    
    // Remaining lives
    private lives: number;
    
    // Position inside the puzzle array
    private arrayPos: Pos;
    
    // Is the part shown already?
    private shown: boolean;
    
    // Constructor
    constructor(lighthouse: Lighthouse, type: LighthousePuzzlePartType, lives: number, arrayPos: Pos, shown: boolean = false){
        // Set from parameters
        this.lighthouse = lighthouse;
        this.type = type;
        this.lives = lives;
        this.arrayPos = arrayPos;
        this.shown = shown;
    }
    
    // Public methods
    public addLives(howMany: number): void{
        this.lives += howMany;
        if(this.lives > 5) this.lives = 5;
    }
    
    public draw(renderArea: RenderArea, pos: Pos): void{
        // If the part is shown already
        if(this.shown){
            // Draw something different depending on the type
            switch(this.type){
                case LighthousePuzzlePartType.BLANK: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/blankPart"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.SHOW_AROUND: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/showAroundPart"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.SHOW_LEFT: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/showLeft"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.SHOW_BELOW: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/showBelow"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.SHOW_ABOVE: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/showAbove"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.SHOW_RIGHT: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/showRight"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.SHOW_LEFT_RIGHT: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/showLeftRight"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.MOVE_BELOW_LINE_TO_THE_RIGHT: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/moveBelowLineToTheRight"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.MOVE_LEFT_LINE_ABOVE: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/moveLeftLineAbove"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.LIVES: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/livesPart"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.WHAT: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/whatPart"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.NOTHING_HERE: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/nothingHerePart"), pos.x, pos.y); break;
                case LighthousePuzzlePartType.STONE: renderArea.drawArray(Database.getAscii("places/lighthouse/puzzle/stonePart"), pos.x, pos.y); break;
            }
            
            // Draw the lives, depending on the type
            switch(this.type){
                // By default, we draw the lives
                default:
                    renderArea.drawHorizontalLine("#", pos.x + 1, pos.x + 1 + this.lives, pos.y + 1);
                break;
            }
            
            // Add a button if we have enough lives
            if(this.lives > 0){
                // Buttons
                for(var i = 0; i < 4; i++){
                    renderArea.addAsciiButton(pos.x + 1, pos.x + 6, pos.y + 1 + i, "lighthousePuzzlePart" + pos.x.toString() + "_" + pos.y.toString());
                }
                // The link
                renderArea.addLinkCall(".lighthousePuzzlePart" + pos.x.toString() + "_" + pos.y.toString(), new CallbackCollection(this.clicked.bind(this)));
            }
        }
    }
    
    // Public getters
    public getLives(): number{
        return this.lives;
    }
    
    public getShown(): boolean{
        return this.shown;
    }
    
    // Public setters
    public setArrayPos(arrayPos: Pos){
        this.arrayPos = arrayPos;
    }
    
    public setShown(shown: boolean): void{
        this.shown = shown;
    }
    
    // Private methods
    private clicked(): void{
        // Create a temporary part, used later
        var tempPart: LighthousePuzzlePart;
        
        // Do something different depending on the type
        switch(this.type){
            case LighthousePuzzlePartType.SHOW_AROUND:
                // If we can show the part above, we show it
                if(this.arrayPos.y > 0 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1].setShown(true);
                // If we can show the part on the right, we show it
                else if(this.arrayPos.x < 6 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y].setShown(true);
                // If we can show the part below, we show it
                else if(this.arrayPos.y < 4 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1].setShown(true);
                // If we can show the part on the left, we show it
                else if(this.arrayPos.x > 0 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y].setShown(true);
            break;
            case LighthousePuzzlePartType.SHOW_LEFT:
                // If we can show the part on the left, we show it
                if(this.arrayPos.x > 0 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y].setShown(true);
            break;
            case LighthousePuzzlePartType.SHOW_BELOW:
                // If we can show the part below, we show it
                if(this.arrayPos.y < 4 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1].setShown(true);
            break;
            case LighthousePuzzlePartType.SHOW_ABOVE:
                // If we can show the part above, we show it
                if(this.arrayPos.y > 0 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1].setShown(true);
            break;
            case LighthousePuzzlePartType.SHOW_RIGHT:
                // If we can show the part on the right, we show it
                if(this.arrayPos.x < 6 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y].setShown(true);
            break;
            case LighthousePuzzlePartType.MOVE_BELOW_LINE_TO_THE_RIGHT:
                if(this.arrayPos.y < 4){
                    tempPart = this.lighthouse.getPuzzle().getParts()[6][this.arrayPos.y+1];
                    for(var i = 6; i > 0; i--){
                        this.lighthouse.getPuzzle().getParts()[i][this.arrayPos.y+1] = this.lighthouse.getPuzzle().getParts()[i-1][this.arrayPos.y+1];
                        if(this.lighthouse.getPuzzle().getParts()[i][this.arrayPos.y+1] != null)
                            this.lighthouse.getPuzzle().getParts()[i][this.arrayPos.y+1].setArrayPos(new Pos(i, this.arrayPos.y+1));
                    }
                    this.lighthouse.getPuzzle().getParts()[0][this.arrayPos.y+1] = tempPart;
                    if(this.lighthouse.getPuzzle().getParts()[0][this.arrayPos.y+1] != null)
                        this.lighthouse.getPuzzle().getParts()[0][this.arrayPos.y+1].setArrayPos(new Pos(0, this.arrayPos.y+1));
                }
            break;
            case LighthousePuzzlePartType.MOVE_LEFT_LINE_ABOVE:
                if(this.arrayPos.x > 0){
                    tempPart = this.lighthouse.getPuzzle().getParts()[this.arrayPos.x-1][0];
                    for(var i = 0; i <= 3; i++){
                        this.lighthouse.getPuzzle().getParts()[this.arrayPos.x-1][i] = this.lighthouse.getPuzzle().getParts()[this.arrayPos.x-1][i+1];
                        if(this.lighthouse.getPuzzle().getParts()[this.arrayPos.x-1][i] != null)
                            this.lighthouse.getPuzzle().getParts()[this.arrayPos.x-1][i].setArrayPos(new Pos(this.arrayPos.x-1, i));
                    }
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x-1][4] = tempPart;
                    if(this.lighthouse.getPuzzle().getParts()[this.arrayPos.x-1][4] != null)
                        this.lighthouse.getPuzzle().getParts()[this.arrayPos.x-1][4].setArrayPos(new Pos(this.arrayPos.x-1, 4));
                }
            break;
            case LighthousePuzzlePartType.LIVES:
                // If we can increase the lives of the part above, we show it
                if(this.arrayPos.y > 0 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1].getShown() == true)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y - 1].addLives(1);
                // If we can increase the lives of the part on the right, we show it
                if(this.arrayPos.x < 6 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y].getShown() == true)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y].addLives(1);
                // If we can increase the lives of the part below, we show it
                if(this.arrayPos.y < 4 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1].getShown() == true)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x][this.arrayPos.y + 1].addLives(1);
                // If we can increase the lives of the part on the left, we show it
                if(this.arrayPos.x > 0 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y].getShown() == true)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y].addLives(1);
            break;
            case LighthousePuzzlePartType.SHOW_LEFT_RIGHT:
                // If we can show the part on the right, we show it
                if(this.arrayPos.x < 6 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x + 1][this.arrayPos.y].setShown(true);
                // If we can show the part on the left, we show it
                else if(this.arrayPos.x > 0 && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y] != null && this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y].getShown() == false)
                    this.lighthouse.getPuzzle().getParts()[this.arrayPos.x - 1][this.arrayPos.y].setShown(true);
            break;
            case LighthousePuzzlePartType.WHAT:
                // Change the type
                this.type = LighthousePuzzlePartType.STONE;
                
                // If we didn't have the stone before
                if(Saving.loadBool("gridItemPossessedP") == false){
                    // Get the stone
                    this.lighthouse.getGame().gainItem("gridItemPossessedP");
                    
                    // Change the speech
                    this.lighthouse.setSpeechId("lighthouseFoundStone");
                }
                // Else, we already had the stone before
                else{
                    // Change the speech
                    this.lighthouse.setSpeechId("lighthouseFoundStoneAgain");
                }
            break;
        }
        
        // Decrease our lives
        this.lives -= 1;
        
        // Update the lighthouse
        this.lighthouse.update();
        this.lighthouse.getGame().updatePlace();
    }
}