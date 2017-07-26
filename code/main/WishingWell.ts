///<reference path="Place.ts"/>

// Candies stuff
Saving.registerBool("wishingWellFirstCandyThrown", false);
Saving.registerNumber("wishingWellPreviousCandyWishPrice", 1);
Saving.registerNumber("wishingWellCurrentCandyWishPrice", 1);

// Lollipops stuff
Saving.registerBool("wishingWellFirstLollipopThrown", false);
Saving.registerNumber("wishingWellCurrentLollipopWishPrice", 1);

// How many chocolate bars did we threw?
Saving.registerBool("wishingWellWeAreEnchanting", false); // If true, it means a chocolate bar was thrown and we're waiting for the player to choose its enchantment
Saving.registerNumber("wishingWellHowManyChocolateBarsThrown", 0);

// How many pains au chocolat did we threw?
Saving.registerBool("wishingWellWeArePainAuChocolating", false); // If true, it means a pain au chocolat was thrown and we're waiting for the player to choose its reward
Saving.registerNumber("wishingWellHowManyPainsAuChocolatThrown", 0);

// Chocolate bars stuff
Saving.registerBool

class WishingWell extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Current speech
    private currentSpeech: string = null;
    
    // Different enchantments possible
    private possibleEnchantments: Enchantment[];
    private possibleEnchantmentsArrayForTheList: string[];
    private selectedEnchantmentId: string = "wishingWellPossibleEnchantment0";
    
    // Gifts
    private selectedGiftId: string = "wishingWellGiftPower";
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.createPossibleEnchantments();
        
        this.renderArea.resizeFromArray(Database.getAscii("places/wishingWell"), 62, 3);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private addEnchantmentIfPossible(enchantment: Enchantment): void{
        if(enchantment.isPossible())
            this.possibleEnchantments.push(enchantment);
    }
    
    private chooseGift(): void{
        switch(this.selectedGiftId){
            case "wishingWellGiftPower":
                Saving.saveNumber("gameGiftPower", Saving.loadNumber("gameGiftPower") + 1);
            break;
            case "wishingWellGiftHealth":
                Saving.saveNumber("gameGiftHealth", Saving.loadNumber("gameGiftHealth") + 1);
            break;
            case "wishingWellGiftMagic":
                Saving.saveNumber("gameGiftMagic", Saving.loadNumber("gameGiftMagic") + 1);
            break;
        }
        
        // We're not pain au chocolating anymore
        Saving.saveBool("wishingWellWeArePainAuChocolating", false);
        
        // Set the speech
        this.currentSpeech = "wishingWellGiftDoneSpeech";
        
        // Re calc max hp
        this.getGame().getPlayer().reCalcMaxHp();
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private createPossibleEnchantments(): void{
        // We empty the array
        this.possibleEnchantments = [];
        
        // We add the echantments
        this.addEnchantmentIfPossible(new Enchantment(new EnchantmentItem(this.getGame(), "eqItemGlovesLeatherGloves", EqItemType.GLOVES), new EnchantmentItem(this.getGame(), "eqItemGlovesRedEnchantedGloves", EqItemType.GLOVES)));
        this.addEnchantmentIfPossible(new Enchantment(new EnchantmentItem(this.getGame(), "eqItemGlovesLeatherGloves", EqItemType.GLOVES), new EnchantmentItem(this.getGame(), "eqItemGlovesPinkEnchantedGloves", EqItemType.GLOVES)));
        this.addEnchantmentIfPossible(new Enchantment(new EnchantmentItem(this.getGame(), "eqItemWeaponTribalSpear", EqItemType.WEAPON), new EnchantmentItem(this.getGame(), "eqItemWeaponSummoningTribalSpear", EqItemType.WEAPON)));
        this.addEnchantmentIfPossible(new Enchantment(new EnchantmentItem(this.getGame(), "eqItemWeaponMonkeyWizardStaff", EqItemType.WEAPON), new EnchantmentItem(this.getGame(), "eqItemWeaponEnchantedMonkeyWizardStaff", EqItemType.WEAPON)));
        this.addEnchantmentIfPossible(new Enchantment(new EnchantmentItem(this.getGame(), "eqItemBodyArmoursKnightBodyArmour", EqItemType.BODYARMOUR), new EnchantmentItem(this.getGame(), "eqItemBodyArmoursEnchantedKnightBodyArmour", EqItemType.BODYARMOUR)));
        this.addEnchantmentIfPossible(new Enchantment(new EnchantmentItem(this.getGame(), "eqItemHatOctopusKingCrown", EqItemType.HAT), new EnchantmentItem(this.getGame(), "eqItemHatOctopusKingCrownWithJaspers", EqItemType.HAT)));
        this.addEnchantmentIfPossible(new Enchantment(new EnchantmentItem(this.getGame(), "eqItemHatOctopusKingCrown", EqItemType.HAT), new EnchantmentItem(this.getGame(), "eqItemHatOctopusKingCrownWithObsidian", EqItemType.HAT)));
        this.addEnchantmentIfPossible(new Enchantment(new EnchantmentItem(this.getGame(), "eqItemWeaponGiantSpoon", EqItemType.WEAPON), new EnchantmentItem(this.getGame(), "eqItemWeaponGiantSpoonOfDoom", EqItemType.WEAPON)));

        // We create the list array
        this.createPossibleEnchantmentsArrayForTheList();
    }
    
    private createPossibleEnchantmentsArrayForTheList(): void{
        this.possibleEnchantmentsArrayForTheList = [];
        
        for(var i = 0; i < this.possibleEnchantments.length; i++){
            this.possibleEnchantmentsArrayForTheList.push("wishingWellPossibleEnchantment" + i, this.possibleEnchantments[i].getBeforeItem().getText() + " -> " + this.possibleEnchantments[i].getAfterItem().getText());
        }
    }
    
    private drawCandiesStuff(x: number, y: number): void{
        // If we didn't throw our first candy yet
        if(Saving.loadBool("wishingWellFirstCandyThrown") == false){
            // The button
            this.renderArea.addAsciiRealButton(Database.getText("wishingWellThrowFirstCandyButton"), x, y, "wishingWellThrowFirstCandyButton", Database.getTranslatedText("wishingWellThrowFirstCandyButton"), true);
            this.renderArea.addLinkCall(".wishingWellThrowFirstCandyButton", new CallbackCollection(this.throwFirstCandy.bind(this)));
        }
        // Else, we already threw our first candy
        else{
            // The button
            this.renderArea.addAsciiRealButton("Throw " + Algo.pluralFormatNicely(Saving.loadNumber("wishingWellCurrentCandyWishPrice"), " candy", " candies") + " in the well", x, y, "wishingWellThrowCandiesButton");
            this.renderArea.addLinkCall(".wishingWellThrowCandiesButton", new CallbackCollection(this.throwCandies.bind(this)));
        }
    }
    
    private drawChocolateBarsStuff(x: number, y: number): void{
        // If we're not enchanting
        if(Saving.loadBool("wishingWellWeAreEnchanting") == false){
            // The button
            this.renderArea.addAsciiRealButton(Database.getText("wishingWellThrowChocolateBarButton"), x, y, "wishingWellThrowChocolateBarButton", Database.getTranslatedText("wishingWellThrowChocolateBarButton"), true);
            // The link
            this.renderArea.addLinkCall(".wishingWellThrowChocolateBarButton", new CallbackCollection(this.throwChocolateBar.bind(this)));
        }
        // Else, we are enchanting
        else{
            // If there's at least one possible enchantment
            if(this.possibleEnchantments.length >= 1){
                // "Choose the enchantment"
                this.renderArea.drawString(Database.getText("wishingWellChooseEnchantment"), x, y);
                this.renderArea.drawString(Database.getTranslatedText("wishingWellChooseEnchantment"), x, y+1, true);
                // The list
                this.renderArea.addList(x, x+30, y+3, "wishingWellEnchantmentList", new CallbackCollection(this.enchantmentSelected.bind(this)), this.possibleEnchantmentsArrayForTheList);    
                // Enchant button
                this.renderArea.addAsciiRealButton(Database.getText("wishingWellEnchantButton"), x, y+6, "wishingWellEnchantButton", Database.getTranslatedText("wishingWellEnchantButton"));
                this.renderArea.addLinkCall(".wishingWellEnchantButton", new CallbackCollection(this.enchant.bind(this)));
                // Add the link which will call the selectRightEnchantment method after the html dom is created
                this.renderArea.addLinkCallbackCollection(new CallbackCollection(this.selectRightEnchantment.bind(this)));
            }
            else{
                // We tell the player that there's nothing to enchant
                this.renderArea.drawString(Database.getText("wishingWellNoPossibleEnchantment"), x, y);
                this.renderArea.drawString(Database.getTranslatedText("wishingWellNoPossibleEnchantment"), x, y+1, true);
            }
        }
    }
    
    private drawLollipopsStuff(x: number, y: number): void{
        // If we didn't throw our first lollipop yet
        if(Saving.loadBool("wishingWellFirstLollipopThrown") == false){
            // The button
            this.renderArea.addAsciiRealButton(Database.getText("wishingWellThrowFirstLollipopButton"), x, y, "wishingWellThrowFirstLollipopButton", Database.getTranslatedText("wishingWellThrowFirstLollipopButton"), true);
            this.renderArea.addLinkCall(".wishingWellThrowFirstLollipopButton", new CallbackCollection(this.throwFirstLollipop.bind(this)));
        }
        // Else, we already threw our first lollipop
        else{
            // The button
            this.renderArea.addAsciiRealButton("Throw " + Algo.pluralFormatNicely(Saving.loadNumber("wishingWellCurrentLollipopWishPrice"), " lollipop", " lollipops") + " in the well", x, y, "wishingWellThrowLollipopsButton");
            this.renderArea.addLinkCall(".wishingWellThrowLollipopsButton", new CallbackCollection(this.throwLollipops.bind(this)));
        }
    }
    
    private drawPainsAuChocolatStuff(x: number, y: number): void{
        // If we're not pain au chocolating
        if(Saving.loadBool("wishingWellWeArePainAuChocolating") == false){
            // The button
            this.renderArea.addAsciiRealButton(Database.getText("wishingWellThrowPainAuChocolatButton"), x, y, "wishingWellThrowPainAuChocolatButton", Database.getTranslatedText("wishingWellThrowPainAuChocolatButton"), true);
            // The link
            this.renderArea.addLinkCall(".wishingWellThrowPainAuChocolatButton", new CallbackCollection(this.throwPainAuChocolat.bind(this)));
        }
        // Else, we are pain au chocolating
        else{
            // "Choose your gift"
            this.renderArea.drawString(Database.getText("wishingWellChooseGift"), x, y);
            this.renderArea.drawString(Database.getTranslatedText("wishingWellChooseGift"), x, y+1, true);
            // The list
            this.renderArea.addList(x, x+30, y+3, "wishingWellGiftList", new CallbackCollection(this.giftSelected.bind(this)), this.getGiftsArray());    
            // Choose gift button
            this.renderArea.addAsciiRealButton(Database.getText("wishingWellChooseGiftButton"), x, y+6, "wishingWellChooseGiftButton", Database.getTranslatedText("wishingWellChooseGiftButton"));
            this.renderArea.addLinkCall(".wishingWellChooseGiftButton", new CallbackCollection(this.chooseGift.bind(this)));
            // Add the link which will call the selectRightEnchantment method after the html dom is created
            this.renderArea.addLinkCallbackCollection(new CallbackCollection(this.giftSelected.bind(this), this.selectRightGift.bind(this)));
        }
    }
    
    private enchant(): void{
        // Get the index of the selected echantment
        var index: number = parseInt(this.selectedEnchantmentId.substr(30));
        
        // Enchant (lose the before item and gain the after item)
        this.possibleEnchantments[index].enchant();
        
        // We're not enchanting anymore
        Saving.saveBool("wishingWellWeAreEnchanting", false);
        
        // We re-create the lists
        this.createPossibleEnchantments();
        
        // Set the speech
        this.currentSpeech = "wishingWellEnchantmentDoneSpeech";
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private enchantmentSelected(): void{
        // Get the selected language id
        this.selectedEnchantmentId = $("#wishingWellEnchantmentList").find(":selected").attr("id");
    }
    
    private getGiftsArray(): string[]{
        // Crate the array
        var arr: string[] = [];
        
        // Add the power gift
        arr.push("wishingWellGiftPower");
        arr.push("More power");
        
        // Add the health gift
        arr.push("wishingWellGiftHealth");
        arr.push("More health");
        
        // Add the magic gift if we have less than 6 in magic gift
        if(Saving.loadNumber("gameGiftMagic") < 6){
            arr.push("wishingWellGiftMagic");
            arr.push("More magic");
        }
        
        // Return the array
        return arr;
    }
    
    private giftSelected(): void{
        // Get the selected language id
        this.selectedGiftId = $("#wishingWellGiftList").find(":selected").attr("id");
    }
    
    private selectRightEnchantment(): void{
        // We select the right question
        $("#" + this.selectedEnchantmentId).prop('selected', true);
    }
    
    private selectRightGift(): void{
        // We select the right question
        $("#" + this.selectedGiftId).prop('selected', true);
    }
    
    private throwCandies(): void{
        // We save the old price
        var oldPrice: number = Saving.loadNumber("wishingWellCurrentCandyWishPrice");
        
        // If we have enough candies
        if(this.getGame().getCandies().getCurrent() >= Saving.loadNumber("wishingWellCurrentCandyWishPrice")){
            // If we need to be healed
            if(this.getGame().getPlayer().getHp() < this.getGame().getPlayer().getMaxHp()){
                // Pay the price
                this.getGame().getCandies().add(-Saving.loadNumber("wishingWellCurrentCandyWishPrice"));
                // Heal the player
                this.getGame().getPlayer().setHp(this.getGame().getPlayer().getMaxHp());
                // Set the speech
                this.currentSpeech = "wishingWellThrewCandiesSpeech";
                // Set the next price
                Saving.saveNumber("wishingWellCurrentCandyWishPrice", Saving.loadNumber("wishingWellPreviousCandyWishPrice")*2 + Saving.loadNumber("wishingWellCurrentCandyWishPrice")*2);
                Saving.saveNumber("wishingWellPreviousCandyWishPrice", oldPrice);
            }
            // Else, no need to be healed
            else{
                // Set the speech
                this.currentSpeech = "wishingWellNoWoundSpeech";
            }
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private throwChocolateBar(): void{
        if(this.getGame().getChocolateBars().getCurrent() >= 1){
            // Pay the price
            this.getGame().getChocolateBars().add(-1);
            // Set the speech (depending on if it's the first bar we throw or not)
            if(Saving.loadNumber("wishingWellHowManyChocolateBarsThrown") == 0)
                this.currentSpeech = "wishingWellChocolateBarIntroductionSpeech";
            else
                this.currentSpeech = "wishingWellThrewChocolateBarSpeech";
            // Increase the number of chocolate bars thrown
            Saving.saveNumber("wishingWellHowManyChocolateBarsThrown", Saving.loadNumber("wishingWellHowManyChocolateBarsThrown") + 1)
            // We are now enchanting
            Saving.saveBool("wishingWellWeAreEnchanting", true);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private throwFirstCandy(): void{
        if(this.getGame().getCandies().getCurrent() >= 1){
            this.getGame().getCandies().add(-1); // We use one candy
            this.currentSpeech = "wishingWellCandyIntroductionSpeech"; // Set the speech
            Saving.saveBool("wishingWellFirstCandyThrown", true); // Change the bool
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private throwFirstLollipop(): void{
        if(this.getGame().getLollipops().getCurrent() >= 1){
            this.getGame().getLollipops().add(-1); // We use one lollipop
            this.currentSpeech = "wishingWellLollipopIntroductionSpeech"; // Set the speech
            Saving.saveBool("wishingWellFirstLollipopThrown", true); // Change the bool
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private throwLollipops(): void{
        // If we have enough lollipops
        if(this.getGame().getLollipops().getCurrent() >= Saving.loadNumber("wishingWellCurrentLollipopWishPrice")){
            // Pay the price
            this.getGame().getLollipops().add(-Saving.loadNumber("wishingWellCurrentLollipopWishPrice"));
            // Add the same amount of candies
            this.getGame().getCandies().add(Math.ceil(Saving.loadNumber("wishingWellCurrentLollipopWishPrice")/2));
            // Set the speech
            this.currentSpeech = "wishingWellThrewLollipopsSpeech";
            // Set the next price
            Saving.saveNumber("wishingWellCurrentLollipopWishPrice", Saving.loadNumber("wishingWellCurrentLollipopWishPrice")*10)
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private throwPainAuChocolat(): void{
        if(this.getGame().getPainsAuChocolat().getCurrent() >= 1){
            // Pay the price
            this.getGame().getPainsAuChocolat().add(-1);
            // Set the speech (depending on if it's the first pain au chocolat we throw or not)
            if(Saving.loadNumber("wishingWellHowManyPainsAuChocolatThrown") == 0)
                this.currentSpeech = "wishingWellPainAuChocolatIntroductionSpeech";
            else
                this.currentSpeech = "wishingWellThrewPainAuChocolatSpeech";
            // Increase the number of pains au chocolat thrown
            Saving.saveNumber("wishingWellHowManyPainsAuChocolatThrown", Saving.loadNumber("wishingWellHowManyPainsAuChocolatThrown") + 1)
            // We are now pain au chocolating
            Saving.saveBool("wishingWellWeArePainAuChocolating", true);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "wishingWellBackToTheMapButton");
        
        // Draw the well
        this.renderArea.drawArray(Database.getAscii("places/wishingWell"), 38, 3);
        
        // Draw the speech if currentSpeech isn't null
        if(this.currentSpeech != null){
            this.renderArea.drawSpeech(Database.getText(this.currentSpeech), 3, 75, 95, "wishingWellSpeech", Database.getTranslatedText(this.currentSpeech));
        }
        
        // Draw various stuff around it
        this.drawCandiesStuff(0, 4);
        if(this.getGame().getLollipops().getMax() >= 1) this.drawLollipopsStuff(0, 9);
        if(this.getGame().getChocolateBars().getMax() >= 1) this.drawChocolateBarsStuff(0, 14);
        if(this.getGame().getPainsAuChocolat().getMax() >= 1) this.drawPainsAuChocolatStuff(0, 24);
    }
}