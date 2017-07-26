///<reference path="House.ts"/>

class FifthHouse extends House{
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resizeFromArray(Database.getAscii("places/village/fifthHouse"), 0, 3);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Public methods
    public willBeDisplayed(): void{
        // We need to update each time we're going to be displayed to avoid a "bug" in a very special case :
        // If the player is in the fifth house and the npc is asking for someone with a weapon
        // And then the player goes to its inventory, equip a weapon and then goes back to the fifth house
        // Here the fifth house must be updated so that the npc know that the player now has a weapon
        this.update();
    }
    
    // Private methods
    private beginQuest(): void{
        this.getGame().setPlace(new Cellar(this.getGame()));
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the village button
        this.addBackToTheVillageButton(this.renderArea, "fifthHouseBackToTheVillageButton");
        
        // Draw the house
        this.renderArea.drawArray(Database.getAscii("places/village/fifthHouse"), 0, 3);
        
        // If we haven't defeated the rats yet
        if(Saving.loadBool("cellarDone") == false){
            // If we have a weapon
            if(this.getGame().getSelectedEqItems()["weapon"] != null){
                // Draw the speech
                this.renderArea.drawSpeech(Database.getText("mapVillageFifthHouseWeaponSpeech"), 6, 44, 67, "fifthHouseSpeech", Database.getTranslatedText("mapVillageFifthHouseWeaponSpeech"));
                
                // Add the button
                this.renderArea.addAsciiRealButton(Database.getText("mapVillageFifthHouseAgree"), 69, 8, "mapVillageFifthHouseAgreeButton", Database.getTranslatedText("mapVillageFifthHouseAgree"), true);
                this.renderArea.addLinkCall(".mapVillageFifthHouseAgreeButton", new CallbackCollection(this.beginQuest.bind(this)));
            }
            // Else, we don't have a weapon yet
            else{
                // Draw the speech
                this.renderArea.drawSpeech(Database.getText("mapVillageFifthHouseNoWeaponSpeech"), 6, 44, 67, "fifthHouseSpeech", Database.getTranslatedText("mapVillageFifthHouseNoWeaponSpeech"));
            }
        }
        // If we have defeated the rats
        else{
            // Draw the speech
            this.renderArea.drawSpeech(Database.getText("mapVillageFifthHouseCellarDone"), 6, 44, 82, "fifthHouseSpeech", Database.getTranslatedText("mapVillageFifthHouseCellarDone"));
            
            // Change the NPC mouth
            this.renderArea.drawString("U", 52, 17);
        }
    }
}