///<reference path="Place.ts"/>

class TheCaveExit extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resizeFromArray(Database.getAscii("places/theCave/exit"), 42, 3);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Draw the background
        this.renderArea.drawArray(Database.getAscii("places/theCave/exit"), 21, 3);
        
        // Draw the text
        this.renderArea.drawString(Database.getText("theCaveExitText0"), 30, 3);
        this.renderArea.drawString(Database.getText("theCaveExitText1"), 30, 4);
        
        // Draw the translated text
        this.renderArea.drawString(Database.getTranslatedText("theCaveExitText0"), 30, 6, true);
        this.renderArea.drawString(Database.getTranslatedText("theCaveExitText1"), 30, 7, true);
        
        // Add the button to return to the main map
        this.renderArea.addAsciiRealButton(Database.getText("theCaveExitButtonText"), 41, 20, "theCaveExitReturnToMapButton", Database.getTranslatedText("theCaveExitButtonText"), true);
        this.renderArea.addLinkCall(".theCaveExitReturnToMapButton", new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())));
    }
}