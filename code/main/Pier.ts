///<reference path="Place.ts"/>

class Pier extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resizeFromArray(Database.getAscii("places/pier"), 0, 6);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private addLighthouseButton(x: number, y: number): void{
        this.renderArea.addAsciiRealButton(Database.getText("pierLighthouseButton"), x, y, "pierLighthouseButton", Database.getTranslatedText("pierLighthouseButton"), true);
        this.renderArea.addLinkCall(".pierLighthouseButton", new CallbackCollection(this.clickedOnLighthouseButton.bind(this), this.getGame().goToLighthouse.bind(this.getGame())));
    }
    
    private addTheSeaButton(x: number, y: number): void{
        this.renderArea.addAsciiRealButton(Database.getText("pierTheSeaButton"), x, y, "pierTheSeaButton", Database.getTranslatedText("pierTheSeaButton"), true);
        this.renderArea.addLinkCall(".pierTheSeaButton", new CallbackCollection(this.goToTheSea.bind(this)));
    }
    
    private clickedOnLighthouseButton(): void{
        Saving.saveBool("mainMapDonePier", true);
    }
    
    private goToTheSea(): void{
        if(this.getGame().canStartQuest())
            this.getGame().setPlace(new TheSea(this.getGame()));
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "thePierBackToTheMapButton");
        
        // Draw the pier
        this.renderArea.drawArray(Database.getAscii("places/pier"), 0, 3);
        
        // Add the button to go to the lighthouse
        this.addLighthouseButton(3, 27);
        
        // Add the button to jump into the sea
        this.addTheSeaButton(52, 9);
    }
}