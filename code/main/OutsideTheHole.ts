///<reference path="Place.ts"/>

class OutsideTheHole extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resizeFromArray(Database.getAscii("places/outsideTheHole"), 0, 4);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods 
    private jump(): void{
        this.getGame().setPlace(new TheHole(this.getGame()));
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "theHoleBackToTheMapButton");
        
        // Draw the ascii
        this.renderArea.drawArray(Database.getAscii("places/outsideTheHole"), 0, 3);
        
        // Add the button to jump in the hole
        this.renderArea.addAsciiRealButton(Database.getText("outsideTheHoleButton"), 34, 23, "outsideTheHoleButton", Database.getTranslatedText("outsideTheHoleButton"), true);
        this.renderArea.addLinkCall(".outsideTheHoleButton", new CallbackCollection(this.jump.bind(this)));
    }
}