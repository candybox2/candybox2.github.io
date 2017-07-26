///<reference path="House.ts"/>

// The lollipop
Saving.registerBool("forgeFoundLollipop", false);

// Items sold
Saving.registerBool("forgeBoughtWoodenSword", false);
Saving.registerBool("forgeBoughtIronAxe", false);
Saving.registerBool("forgeBoughtPolishedSilverSword", false);
Saving.registerBool("forgeBoughtLightweightBodyArmour", false);
Saving.registerBool("forgeBoughtScythe", false);

class Forge extends House{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // The speech, comes back to its default value each time we enter the forge
    private currentSpeech: string;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // If...
            // We didn't buy one of the first three items
        if((Saving.loadBool("forgeBoughtWoodenSword") == false || Saving.loadBool("forgeBoughtIronAxe") == false || Saving.loadBool("forgeBoughtPolishedSilverSword") == false)
            || // OR
            // We didn't buy the armour and we made the cave entrance
           (Saving.loadBool("forgeBoughtLightweightBodyArmour") == false && Saving.loadBool("mainMapDoneCaveEntrance") == true)
            || // OR
            // We didn't buy the scythe and the dragon is done
           (Saving.loadBool("forgeBoughtScythe") == false && Saving.loadBool("dragonDone") == true)
        ){
            // We set the normal introduction speech
            this.currentSpeech = "mapVillageForgeIntroductionSpeech";
        }
        // Else
        else{
            // We set the no more to sell introduction speech
            this.currentSpeech = "mapVillageForgeIntroductionSpeechNoMoreToSell";
        }
        
        this.renderArea.resizeFromArray(Database.getAscii("places/village/forge"), 0, 3);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private clickedBuyIronAxeButton(): void{
        if(this.getGame().getCandies().getCurrent() >= 400){
            this.getGame().getCandies().add(-400); // -400 candies
            Saving.saveBool("forgeBoughtIronAxe", true); // We bought the axe
            this.getGame().gainItem("eqItemWeaponIronAxe"); // We now own the axe
            this.currentSpeech = "mapVillageForgeBuyIronAxeSpeech"; // New speech
            // We update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private clickedBuyLightweightBodyArmourButton(): void{
        if(this.getGame().getCandies().getCurrent() >= 15000){
            this.getGame().getCandies().add(-15000); // -15000 candies
            Saving.saveBool("forgeBoughtLightweightBodyArmour", true); // We bought the armour
            this.getGame().gainItem("eqItemBodyArmoursLightweightBodyArmour"); // We now own the armour
            this.currentSpeech = "mapVillageForgeBuyLightweightBodyArmourSpeech"; // New speech
            // We update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private clickedBuyPolishedSilverSwordButton(): void{
        if(this.getGame().getCandies().getCurrent() >= 2000){
            this.getGame().getCandies().add(-2000); // -2000 candies
            Saving.saveBool("forgeBoughtPolishedSilverSword", true); // We bought the sword
            this.getGame().gainItem("eqItemWeaponPolishedSilverSword"); // We now own the sword
            this.currentSpeech = "mapVillageForgeBuyPolishedSilverSwordSpeech"; // New speech
            // We update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private clickedBuyScytheButton(): void{
        if(this.getGame().getCandies().getCurrent() >= 5000000){
            this.getGame().getCandies().add(-5000000); // -5000000 candies
            Saving.saveBool("forgeBoughtScythe", true); // We bought the scythe
            this.getGame().gainItem("eqItemWeaponScythe"); // We now own the scythe
            this.currentSpeech = "mapVillageForgeBuyScytheSpeech"; // New speech
            // We update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private clickedBuyWoodenSwordButton(): void{
        if(this.getGame().getCandies().getCurrent() >= 150){
            this.getGame().getCandies().add(-150); // -150 candies
            Saving.saveBool("forgeBoughtWoodenSword", true); // We bought the sword
            this.getGame().gainItem("eqItemWeaponWoodenSword"); // We now own the sword
            this.currentSpeech = "mapVillageForgeBuyWoodenSwordSpeech"; // New speech
            Saving.saveBool("statusBarUnlockedInventory", true); // We unlock the inventory
            this.getGame().updateStatusBar(true); // We update the status bar
            this.getGame().getStatusBar().selectTabByType(StatusBarTabType.MAP); // We re-select the map tab (because adding the inventory tab created a gap in tab selection..)
            // We update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private drawLollipopStuff(x: number, y: number): void{
        // If we didn't find the lollipop yet
        if(Saving.loadBool("forgeFoundLollipop") == false){
            // We add a button to take the lollipop on the cupboard
            this.renderArea.addAsciiButton(x, x+5, y, "forgeLollipopButton");
            // We add the link
            this.renderArea.addLinkCall(".forgeLollipopButton", new CallbackCollection(this.takeLollipop.bind(this)));
        }
        // Else, we found the lollipop
        else{
            // We erase the lollipop
            this.renderArea.drawString("      ", x, y);
        }
    }
    
    private takeLollipop(): void{
        // If we didn't get the lollipop yet
        if(Saving.loadBool("forgeFoundLollipop") == false){
            // Add one lollipop
            this.getGame().getLollipops().add(1);
            // Set the bool
            Saving.saveBool("forgeFoundLollipop", true);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToTheVillageButton(this.renderArea, "forgeBackToTheVillageButton");
        
        // Draw the house
        this.renderArea.drawArray(Database.getAscii("places/village/forge"), 0, 3);
        
        // Draw the stuff about the lollipop
        this.drawLollipopStuff(18, 15);
        
        // Draw the blacksmith's speech
        this.renderArea.drawSpeech(Database.getText(this.currentSpeech), 13, 44, 67, "forgeSpeech", Database.getTranslatedText(this.currentSpeech));
        
        // Draw the buttons
            // If we never bought the wooden sword and we don't have one
            if(Saving.loadBool("forgeBoughtWoodenSword") == false && Saving.loadBool("eqItemWeaponWoodenSword") == false){
                this.renderArea.addAsciiRealButton(Database.getText("mapVillageForgeBuyWoodenSwordButton"), 8, 35, "mapVillageForgeBuyWoodenSwordButton", Database.getTranslatedText("mapVillageForgeBuyWoodenSwordButton"), true, -1, null, false);
                this.renderArea.addLinkCall(".mapVillageForgeBuyWoodenSwordButton", new CallbackCollection(this.clickedBuyWoodenSwordButton.bind(this)));
            }
            // If we bought the wooden sword, never bought the iron axe and we don't have one
            else if(Saving.loadBool("forgeBoughtWoodenSword") == true && Saving.loadBool("forgeBoughtIronAxe") == false && Saving.loadBool("eqItemWeaponIronAxe") == false){
                this.renderArea.addAsciiRealButton(Database.getText("mapVillageForgeBuyIronAxeButton"), 8, 35, "mapVillageForgeBuyIronAxeButton", Database.getTranslatedText("mapVillageForgeBuyIronAxeButton"), true, -1, null, false);
                this.renderArea.addLinkCall(".mapVillageForgeBuyIronAxeButton", new CallbackCollection(this.clickedBuyIronAxeButton.bind(this)));
            }
            // If we bought the iron axe, never bought the polished silver sword and we don't have one
            else if(Saving.loadBool("forgeBoughtIronAxe") == true && Saving.loadBool("forgeBoughtPolishedSilverSword") == false && Saving.loadBool("eqItemWeaponPolishedSilverSword") == false){
                this.renderArea.addAsciiRealButton(Database.getText("mapVillageForgeBuyPolishedSilverSwordButton"), 8, 35, "mapVillageForgeBuyPolishedSilverSwordButton", Database.getTranslatedText("mapVillageForgeBuyPolishedSilverSwordButton"), true, -1, null, false);
                this.renderArea.addLinkCall(".mapVillageForgeBuyPolishedSilverSwordButton", new CallbackCollection(this.clickedBuyPolishedSilverSwordButton.bind(this)));
            }
            // If we bought the polished silver sword, never bought the lightweight body armour and we don't have one and we made the cave entrance
            else if(Saving.loadBool("forgeBoughtPolishedSilverSword") == true && Saving.loadBool("forgeBoughtLightweightBodyArmour") == false && Saving.loadBool("eqItemBodyArmoursLightweightBodyArmour") == false && Saving.loadBool("mainMapDoneCaveEntrance")){
                this.renderArea.addAsciiRealButton(Database.getText("mapVillageForgeBuyLightweightBodyArmourButton"), 8, 35, "mapVillageForgeBuyLightweightBodyArmourButton", Database.getTranslatedText("mapVillageForgeBuyLightweightBodyArmourButton"), true, -1, null, false);
                this.renderArea.addLinkCall(".mapVillageForgeBuyLightweightBodyArmourButton", new CallbackCollection(this.clickedBuyLightweightBodyArmourButton.bind(this)));
            }
            // If we bought the lightweight body armour, never bought the scythe and we don't have one and the dragon is done
            else if(Saving.loadBool("forgeBoughtLightweightBodyArmour") == true && Saving.loadBool("forgeBoughtScythe") == false && Saving.loadBool("eqItemWeaponScythe") == false && Saving.loadBool("dragonDone")){
                this.renderArea.addAsciiRealButton(Database.getText("mapVillageForgeBuyScytheButton"), 8, 35, "mapVillageForgeBuyScytheButton", Database.getTranslatedText("mapVillageForgeBuyScytheButton"), true, -1, null, false);
                this.renderArea.addLinkCall(".mapVillageForgeBuyScytheButton", new CallbackCollection(this.clickedBuyScytheButton.bind(this)));
            }
    }
}