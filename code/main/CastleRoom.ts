///<reference path="Place.ts"/>

class CastleRoom extends Place{
    // Constructor
    constructor(game: Game){
        super(game);
    }
    
    // Special method used to add a button to go back to the castle
    public addBackToTheCastleButton(renderArea: RenderArea, otherClass: string): void{
        this.addBackToButton(renderArea,
                             new CallbackCollection(this.getGame().goToCastle.bind(this.getGame())),
                             Database.getText("buttonBackToTheCastle"),
                             Database.getTranslatedText("buttonBackToTheCastle"),
                             otherClass);
    }
}