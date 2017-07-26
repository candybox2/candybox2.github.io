///<reference path="Place.ts"/>

class Moutains extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resizeFromArray(Database.getAscii("places/mountains"), 0, 10);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private getPogoStick(): void{
        // Get the pogo stick
        this.getGame().gainItem("gridItemPossessedPogoStick");
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "mountainsBackToTheMapButton");
        
        // Draw the moutains
        this.renderArea.drawArray(Database.getAscii("places/mountains"), 0, 3);
        
        // If we didn't get the pogo stick yet
        if(Saving.loadBool("gridItemPossessedPogoStick") == false){
            // Add the "*" showing that there's a pogo stick here
            this.renderArea.drawString("*", 52, 11);
            
            // Draw the text
            this.renderArea.drawString(Database.getText("mountainsText0"), 19, 22);
            this.renderArea.drawString(Database.getText("mountainsText1"), 19, 23);
            
            // Add the button
            this.renderArea.addAsciiRealButton(Database.getText("mountainsTextButton"), 19, 25, "mountainsClimbButton", Database.getTranslatedText("mountainsTextButton"));
            this.renderArea.addLinkCall(".mountainsClimbButton", new CallbackCollection(this.getPogoStick.bind(this)));
            
            // Draw the translated text
            this.renderArea.drawString(Database.getTranslatedText("mountainsText0"), 19, 27, true);
            this.renderArea.drawString(Database.getTranslatedText("mountainsText1"), 19, 28, true);
        }
        // Else, we already found it
        else{
            this.renderArea.drawString(Database.getText("mountainsTextAfter"), 19, 22);
            
            this.renderArea.drawString(Database.getTranslatedText("mountainsTextAfter"), 19, 24, true);
        }
    }
}