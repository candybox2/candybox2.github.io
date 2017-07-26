///<reference path="Place.ts"/>

class Village extends Place{
    // Render areas
    private renderArea: RenderArea = new RenderArea();
    
    // Smoke
    private smokes: Smoke[] = [new Smoke(8, 26, 1, 3, 1, 3),
                               new Smoke(64, 26, 2, 4, 0, 0),
                               new Smoke(80, 26, 1, 3, 1, 3),
                               new Smoke(59, 42, 1, 3, 1, 3)
                              ];
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the area
        this.renderArea.resizeFromArray(Database.getAscii("places/village/village"), 0, 3);
        
        // Update
        this.update();
    }
    
    // Public methods    
    public willBeDisplayed(): void{
        this.getGame().getOneSecondCallbackCollection().addCallback(this.actionSmokes.bind(this));
        this.update(); // We update. This is needed because the village is the first thing to be loaded when we launch the game
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private actionSmokes(): void{
        // We make the smokes move
        for(var i = 0; i < this.smokes.length; i++){
            this.smokes[i].move();
        }
        
        // We update on the page
        this.update();
        this.getGame().updatePlace();
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button only if we possess the main map
        if(Saving.loadBool("gridItemPossessedMainMap"))
            this.addBackToMainMapButton(this.renderArea, "villageBackToTheMapButton");
        
        // Draw the ascii
        this.renderArea.drawArray(Database.getAscii("places/village/village"), 0, 3);
        
        // Draw smokes
        for(var i = 0; i < this.smokes.length; i++){
            this.smokes[i].draw(this.renderArea);
        }
        
        // Load various things
        this.loadFirstHouse(2, 3 + 24);
        this.loadSecondHouse(18, 3 + 21);
        this.loadThirdHouse(32, 3 + 25);
        this.loadForge(61, 3 + 24);
        this.loadFourthHouse(77, 3 + 24);
        this.loadFifthHouse(91, 3 + 25);
    }
    
    // Private "go to" methods
    private goToFirstHouse(): void{
        alert("yay");
    }
    
    private goToSecondHouse(): void{
        this.getGame().setPlace(new SecondHouse(this.getGame()));
    }
    
    private goToThirdHouse(): void{
        this.getGame().setPlace(new ThirdHouse(this.getGame()));
    }
    
    private goToForge(): void{
        this.getGame().setPlace(new Forge(this.getGame()));
    }
    
    private goToFourthHouse(): void{
        this.getGame().setPlace(new FourthHouse(this.getGame()));
    }
    
    private goToFifthHouse(): void{
        this.getGame().setPlace(new FifthHouse(this.getGame()));
    }
    
    // Private "load" methods
    private loadFirstHouse(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiNinjaButtons("mapVillageFirstHouseButton",
            x+6, x+8, y,
            x+1, x+10, y+1,
            x, x+11, y+2,
            x-1, x+12, y+3,
            x, x+11, y+4,
            x, x+11, y+5);
        // Comments
        this.renderArea.addFullComment(x + 6, y + 6, Database.getText("mapVillageLockedHouseComment"), Database.getTranslatedText("mapVillageLockedHouseComment"), "mapVillageFirstHouseComment");
        // Interactions
        this.renderArea.addLinkOver(".mapVillageFirstHouseButton, .mapVillageFirstHouseComment", ".mapVillageFirstHouseComment");
    }
    
    private loadSecondHouse(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapVillageSecondHouseButton",
            x+1, x+9, y,
            x, x+10, y+1,
            x-1, x+11, y+2,
            x, x+10, y+3,
            x, x+10, y+4,
            x, x+10, y+5,
            x, x+10, y+6,
            x, x+10, y+7,
            x, x+10, y+8);
        // Comments
        this.renderArea.addFullComment(x + 5, y + 9, Database.getText("mapVillageTheShopComment"), Database.getTranslatedText("mapVillageTheShopComment"), "mapVillageSecondHouseComment");
        // Interactions
        this.renderArea.addLinkOver(".mapVillageSecondHouseButton, .mapVillageSecondHouseComment", ".mapVillageSecondHouseComment");
        this.renderArea.addLinkCall(".mapVillageSecondHouseButton, .mapVillageSecondHouseComment", new CallbackCollection(this.goToSecondHouse.bind(this)));
    }
    
    private loadThirdHouse(x: number, y: number){
        // If we have the key to the third house
        if(Saving.loadBool("gridItemPossessedThirdHouseKey")){
            // Buttons
            this.renderArea.addMultipleAsciiButtons("mapVillageThirdHouseButton",
                x+1, x+7, y,
                x, x+8, y+1,
                x-1, x+9, y+2,
                x, x+8, y+3,
                x, x+8, y+4);
            // Comments
            this.renderArea.addFullComment(x + 4, y + 5, Database.getText("mapVillageAHouseComment"), Database.getTranslatedText("mapVillageAHouseComment"), "mapVillageThirdHouseComment");
            // Interactions
            this.renderArea.addLinkOver(".mapVillageThirdHouseButton, .mapVillageThirdHouseComment", ".mapVillageThirdHouseComment");
            this.renderArea.addLinkCall(".mapVillageThirdHouseButton, .mapVillageThirdHouseComment", new CallbackCollection(this.goToThirdHouse.bind(this)));
        }
        // Else, we don't have the key
        else{
            // Buttons
            this.renderArea.addMultipleAsciiNinjaButtons("mapVillageThirdHouseButton",
                x+1, x+7, y,
                x, x+8, y+1,
                x-1, x+9, y+2,
                x, x+8, y+3,
                x, x+8, y+4);
            // Comments
            this.renderArea.addFullComment(x + 4, y + 5, Database.getText("mapVillageLockedHouseComment"), Database.getTranslatedText("mapVillageLockedHouseComment"), "mapVillageThirdHouseComment");
            // Interactions
            this.renderArea.addLinkOver(".mapVillageThirdHouseButton, .mapVillageThirdHouseComment", ".mapVillageThirdHouseComment");
        }
    }
    
    private loadForge(x: number, y: number){
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapVillageForgeButton",
            x+3, x+6, y,
            x+1, x+10, y+1,
            x, x+11, y+2,
            x-1, x+12, y+3,
            x, x+11, y+4,
            x, x+11, y+5);
        // Comments
        this.renderArea.addFullComment(x + 6, y + 6, Database.getText("mapVillageForgeComment"), Database.getTranslatedText("mapVillageForgeComment"), "mapVillageForgeComment");
        // Interactions
        this.renderArea.addLinkOver(".mapVillageForgeButton, .mapVillageForgeComment", ".mapVillageForgeComment");
        this.renderArea.addLinkCall(".mapVillageForgeButton, .mapVillageForgeComment", new CallbackCollection(this.goToForge.bind(this)));
    }
    
    private loadFourthHouse(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapVillageFourthHouseButton",
            x+3, x+5, y,
            x+1, x+10, y+1,
            x, x+11, y+2,
            x-1, x+12, y+3,
            x, x+11, y+4,
            x, x+11, y+5);
        // Comments
        this.renderArea.addFullComment(x + 6, y + 6, Database.getText("mapVillageAHouseComment"), Database.getTranslatedText("mapVillageAHouseComment"), "mapVillageFourthHouseComment");
        // Interactions
        this.renderArea.addLinkOver(".mapVillageFourthHouseButton, .mapVillageFourthHouseComment", ".mapVillageFourthHouseComment");
        this.renderArea.addLinkCall(".mapVillageFourthHouseButton, .mapVillageFourthHouseComment", new CallbackCollection(this.goToFourthHouse.bind(this)));
    }
    
    private loadFifthHouse(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapVillageFifthHouseButton",
            x+1, x+9, y,
            x, x+10, y+1,
            x-1, x+11, y+2,
            x, x+10, y+3,
            x, x+10, y+4);
        // Comments
        this.renderArea.addFullComment(x + 5, y + 5, Database.getText("mapVillageAHouseComment"), Database.getTranslatedText("mapVillageAHouseComment"), "mapVillageFifthHouseComment");
        // Interactions
        this.renderArea.addLinkOver(".mapVillageFifthHouseButton, .mapVillageFifthHouseComment", ".mapVillageFifthHouseComment");
        this.renderArea.addLinkCall(".mapVillageFifthHouseButton, .mapVillageFifthHouseComment", new CallbackCollection(this.goToFifthHouse.bind(this)));
    }
}