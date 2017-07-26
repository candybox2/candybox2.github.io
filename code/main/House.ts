///<reference path="Place.ts"/>

class House extends Place{
    // Constructor
    constructor(game: Game){
        super(game);
    }
    
    // Special method used to add a button to go back to the village
    public addBackToTheVillageButton(renderArea: RenderArea, otherClass: string): void{
        this.addBackToButton(renderArea,
                             new CallbackCollection(this.getGame().goToVillage.bind(this.getGame())),
                             Database.getText("buttonBackToTheVillage"),
                             Database.getTranslatedText("buttonBackToTheVillage"),
                             otherClass);
    }
}