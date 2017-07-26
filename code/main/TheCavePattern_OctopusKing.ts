///<reference path="TheCavePattern.ts"/>

class TheCavePattern_OctopusKing extends TheCavePattern{
    // Constructor
    constructor(theCave: TheCave){
        super(theCave);
    }
    
    // Public methods
    public draw(renderArea: RenderArea, x: number, y: number): void{
        // Draw the monkey wizard
        renderArea.drawArray(Database.getAscii("places/theCave/octopusKing"), x + 32, y + 6, new RenderTransparency(" ", "%"));
        
        // Add the button & the link allowing the player to challenge him
        renderArea.addAsciiRealButton(Database.getText("theCavePattern_OctopusKingButton"), x + 39, y + 26, "theCavePattern_OctopusKingButton", Database.getTranslatedText("theCavePattern_OctopusKingButton"));
        renderArea.addLinkCall(".theCavePattern_OctopusKingButton", new CallbackCollection(this.challenge.bind(this)));
    }
    
    public ended(): boolean{
        return true;
    }
    
    public getSentence(): string{
        return "theCavePattern_OctopusKingSentence";
    }
    
    // Private methods
    private challenge(): void{
        if(this.getTheCave().getGame().canStartQuest())
            this.getTheCave().getGame().setPlace(new OctopusKingQuest(this.getTheCave().getGame()));
    }
}