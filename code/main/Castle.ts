///<reference path="Place.ts"/>

Saving.registerBool("castleKilledNougatMonster", false);

class Castle extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resizeFromArray(Database.getAscii("places/castle/map"), 0, 5);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods   
    private drawBigRoom(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("castleBigRoomButton", 
                                     x, x+1, y,
                                     x, x+1, y+1);
        
        // Comment
        this.renderArea.addFullComment(x - 9, y, Database.getText("castleBigRoomComment"), Database.getTranslatedText("castleBigRoomComment"), "castleBigRoomComment");
        
        // Interactions
        this.renderArea.addLinkOver(".castleBigRoomButton, .castleBigRoomComment", ".castleBigRoomComment");
        this.renderArea.addLinkCall(".castleBigRoomButton", new CallbackCollection(this.goToBigRoom.bind(this)));
    }
    
    private drawCastleEntrance(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiNinjaButtons("castleCastleEntranceButton", 
                                     x, x+2, y);
        
        // Comment
        this.renderArea.addFullComment(x+1, y+1, Database.getText("castleCastleEntranceComment"), Database.getTranslatedText("castleCastleEntranceComment"), "castleCastleEntranceComment");
        
        // Interactions
        this.renderArea.addLinkOver(".castleCastleEntranceButton, .castleCastleEntranceComment", ".castleCastleEntranceComment");
    }
    
    private drawNougatMonster(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("castleNougatMonsterButton", 
                                     x+1, x+8, y,
                                     x, x+10, y+1,
                                     x, x+10, y+2,
                                     x+1, x+8, y+3);
        
        // Comment
        this.renderArea.addFullComment(x+5, y-2, Database.getText("castleNougatMonsterComment"), Database.getTranslatedText("castleNougatMonsterComment"), "castleNougatMonsterComment");
        
        // Interactions
        this.renderArea.addLinkOver(".castleNougatMonsterButton, .castleNougatMonsterComment", ".castleNougatMonsterComment");
        this.renderArea.addLinkCall(".castleNougatMonsterButton", new CallbackCollection(this.goToNougatMonster.bind(this)));
    }
    
    private drawRoom1(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("castleRoom1Button", 
                                     x, x+1, y,
                                     x, x+1, y+1);
        
        // Comment
        this.renderArea.addFullComment(x - 6, y, Database.getText("castleARoomComment"), Database.getTranslatedText("castleARoomComment"), "castleRoom1Comment");
        
        // Interactions
        this.renderArea.addLinkOver(".castleRoom1Button, .castleRoom1Comment", ".castleRoom1Comment");
        this.renderArea.addLinkCall(".castleRoom1Button, .castleRoom1Comment", new CallbackCollection(this.goToRoom1.bind(this)));
    }
    
    private drawRoom2(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("castleRoom2Button", 
                                     x, x+1, y,
                                     x, x+1, y+1);
        
        // Comment
        this.renderArea.addFullComment(x - 6, y, Database.getText("castleADarkRoomComment"), Database.getTranslatedText("castleADarkRoomComment"), "castleRoom2Comment");
        
        // Interactions
        this.renderArea.addLinkOver(".castleRoom2Button, .castleRoom2Comment", ".castleRoom2Comment");
        this.renderArea.addLinkCall(".castleRoom2Button, .castleRoom2Comment", new CallbackCollection(this.goToRoom2.bind(this)));
    }
    
    private drawRoom3(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("castleRoom3Button", 
                                     x, x+1, y,
                                     x, x+1, y+1);
        
        // Comment
        this.renderArea.addFullComment(x - 6, y, Database.getText("castleARoomComment"), Database.getTranslatedText("castleARoomComment"), "castleRoom3Comment");
        
        // Interactions
        this.renderArea.addLinkOver(".castleRoom3Button, .castleRoom3Comment", ".castleRoom3Comment");
        this.renderArea.addLinkCall(".castleRoom3Button, .castleRoom3Comment", new CallbackCollection(this.goToRoom3.bind(this)));
    }
    
    private drawStairs(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("castleStairsButton", 
                                     x, x+4, y,
                                     x, x+4, y+1,
                                     x, x+4, y+2,
                                     x, x+4, y+3,
                                     x, x+4, y+4);
        
        // Comment
        this.renderArea.addFullComment(x + 10, y+2, Database.getText("castleStairsComment"), Database.getTranslatedText("castleStairsComment"), "castleStairsComment");
        
        // Interactions
        this.renderArea.addLinkOver(".castleStairsButton, .castleStairsComment", ".castleStairsComment");
        this.renderArea.addLinkCall(".castleStairsButton", new CallbackCollection(this.goToStairs.bind(this)));
    }
    
    private drawTowerEntrance(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("castleTowerEntranceButton", 
                                     x, x+1, y,
                                     x, x+1, y+1);
        
        // Comment
        this.renderArea.addFullComment(x + 12, y, Database.getText("castleTowerEntranceComment"), Database.getTranslatedText("castleTowerEntranceComment"), "castleTowerEntranceComment");
        
        // Interactions
        this.renderArea.addLinkOver(".castleTowerEntranceButton, .castleTowerEntranceComment", ".castleTowerEntranceComment");
        this.renderArea.addLinkCall(".castleTowerEntranceButton", new CallbackCollection(this.goToTowerEntrance.bind(this)));
    }
    
    private goToBigRoom(): void{
        this.getGame().setPlace(new CastleBigRoom(this.getGame()));
    }

    private goToNougatMonster(): void{
        this.getGame().setPlace(new GiantNougatMonsterQuest(this.getGame()));
    }
    
    private goToRoom1(): void{
        this.getGame().setPlace(new CastleRoom1(this.getGame()));
    }
    
    private goToRoom2(): void{
        this.getGame().setPlace(new CastleRoom2(this.getGame()));
    }
    
    private goToRoom3(): void{
        this.getGame().setPlace(new CastleRoom3(this.getGame()));
    }
    
    private goToStairs(): void{
        this.getGame().setPlace(new Dragon(this.getGame()));
    }
    
    private goToTowerEntrance(): void{
        this.getGame().setPlace(new CastleTower(this.getGame()));
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "castleBackToTheMapButton");
        
        // Draw the ascii
        this.renderArea.drawArray(Database.getAscii("places/castle/map"), 0, 3);
        
        // Draw various stuff
        this.drawCastleEntrance(43, 36);
        this.drawBigRoom(57, 19);
        this.drawRoom1(15, 27);
        this.drawRoom2(15, 21);
        this.drawRoom3(15, 15);
        this.drawNougatMonster(68, 15);
        this.drawStairs(32, 3);
        if(Saving.loadBool("castleKilledNougatMonster")){
            this.drawTowerEntrance(84, 16);
        }
    }
}