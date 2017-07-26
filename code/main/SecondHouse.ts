///<reference path="House.ts"/>

// Lollipops
Saving.registerBool("secondHouseLollipop1Bought", false);
Saving.registerBool("secondHouseLollipop2Bought", false);
Saving.registerBool("secondHouseLollipop3Bought", false);

// The leather boots
Saving.registerBool("secondHouseLeatherBootsBought", false);

// The chocolate bar
Saving.registerBool("secondHouseChocolateBarBought", false);

// The merchant's hat
Saving.registerBool("secondHouseMerchantHatBought", false);

// The time ring
Saving.registerBool("secondHouseTimeRingBought", false);

class SecondHouse extends House{
    private renderArea: RenderArea = new RenderArea();
    
    // Items sold by the candy merchant
    private items: CandyMerchantItem[] = [];
    
    // Selected item (an item is selected when the players clicks on it)
    private selectedItemIndex: number = null;
    
    // Should we draw the intro speech ? (will be set to false as soon as we select an item)
    private shouldDrawIntroSpeech: boolean = true;
    
    // Constructor
    constructor(game: Game){
        // House constructor
        super(game);
        
        // We add all the items
            // Lollipops
            this.addItem(new CandyMerchantItem_Lollipop(this.getGame(), "secondHouseLollipop1Bought", "places/village/candyMerchantItems/lollipopRight", new Pos(14, 22), "secondHouseLollipop1Speech", 60, "secondHouseLollipopButtonText", "secondHouseLollipop1Button"));
            this.addItem(new CandyMerchantItem_Lollipop(this.getGame(), "secondHouseLollipop2Bought", "places/village/candyMerchantItems/lollipopLeft", new Pos(12, 23), "secondHouseLollipop2Speech", 60, "secondHouseLollipopButtonText", "secondHouseLollipop2Button"));
            this.addItem(new CandyMerchantItem_Lollipop(this.getGame(), "secondHouseLollipop3Bought", "places/village/candyMerchantItems/lollipopRight", new Pos(18, 24), "secondHouseLollipop3Speech", 60, "secondHouseLollipopButtonText", "secondHouseLollipop3Button"));
            // The leather boots
            this.addItem(new CandyMerchantItem_LeatherBoots(this.getGame(), "eqItemBootsLeatherBoots", "places/village/candyMerchantItems/boots", new Pos(5, 25), "secondHouseLeatherBootsSpeech", 300, "secondHouseLeatherBootsButtonText", "secondHouseLeatherBootsButton"));
            // The chocolate bar
            this.addItem(new CandyMerchantItem_ChocolateBar(this.getGame(), "secondHouseChocolateBarBought", "places/village/candyMerchantItems/chocolateBar", new Pos(62, 27), "secondHouseChocolateBarSpeech", 800, "secondHouseChocolateBarButtonText", "secondHouseChocolateBarButton"));
            // The merchant hat
            this.addItem(new CandyMerchantItem_MerchantHat(this.getGame(), "secondHouseMerchantHatBought", "places/village/candyMerchantItems/hat", new Pos(53, 13), "secondHouseMerchantHatSpeech", 1000000, "secondHouseMerchantHatButtonText", "secondHouseMerchantHatButton"));
            // The time ring
            this.addItem(new CandyMerchantItem_TimeRing(this.getGame(), "secondHouseTimeRingBought", "places/village/candyMerchantItems/timeRing", new Pos(43, 28), "secondHouseTimeRingSpeech", 500, "secondHouseTimeRingButtonText", "secondHouseTimeRingButton"));
            // Leather gloves
            this.addItem(new CandyMerchantItem_LeatherGloves(this.getGame(), "eqItemGlovesLeatherGloves", "places/village/candyMerchantItems/leatherGloves", new Pos(82, 27), "secondHouseLeatherGlovesSpeech", 300, "secondHouseLeatherGlovesButtonText", "secondHouseLeatherGlovesButton"));
            
        // We resize the render area and update it
        this.renderArea.resizeFromArray(Database.getAscii("places/village/secondHouse"), 0, 3);
        this.update();
    }
    
    // Public methods
    public willBeDisplayed(): void{
        // We need to update each time we're going to be displayed in case some item should not be sold anymore because of some stuff we were doing while this place wasn't displayed
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private addItem(item: CandyMerchantItem): void{
        this.items.push(item);
    }
    
    private buySelectedItem(): void{
        // If we have enough candies to buy it
        if(this.getGame().getCandies().getCurrent() >= this.items[this.selectedItemIndex].getPrice()){
            // We pay the price
            this.getGame().getCandies().add(-this.items[this.selectedItemIndex].getPrice());
            // We tell the item that we just bought it
            this.items[this.selectedItemIndex].buy();
            // No more selected item
            this.selectedItemIndex = null;
            // We update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private clickedOnItem(index: number): void{
        // Set the currently selected item index
        this.selectedItemIndex = index;
        
        // We shouldn't draw the intro speech anymore
        this.shouldDrawIntroSpeech = false;
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private drawIntroSpeech(): void{
        this.drawSpeech("secondHouseIntroSpeech");
    }
    
    private drawItems(): void{
        for(var i = 0; i < this.items.length; i++){
            // If we can show this item
            if(this.items[i].canBeShown()){
                // We draw the item at the correct position
                this.renderArea.drawArray(Database.getAscii(this.items[i].getAsciiName()), this.items[i].getAsciiPosition().x, this.items[i].getAsciiPosition().y, new RenderTransparency(" ", "%"));
                
                // If it can be clicked
                if(this.items[i].canBeClicked()){
                    // We add the button and the link to be able to click it (we add it on each line of the ascii art)
                    for(var j = 0; j < Database.getAsciiHeight(this.items[i].getAsciiName()); j++){
                        // Button
                        this.renderArea.addAsciiButton(this.items[i].getAsciiPosition().x, this.items[i].getAsciiPosition().x + Database.getAsciiWidth(this.items[i].getAsciiName()), this.items[i].getAsciiPosition().y + j, this.items[i].getButtonName() + "RealItem");
                        // Link
                        this.renderArea.addLinkCall("." + this.items[i].getButtonName() + "RealItem", new CallbackCollection(this.clickedOnItem.bind(this, i)));
                    }
                }
            }
        }
    }
    
    private drawSelectedItemStuff(): void{
        var yPos: number; // Will contain the y position of the bottom of the speech
        
        // Draw the speech
        yPos = this.drawSpeech(this.items[this.selectedItemIndex].getMerchantSpeech());
        
        // If we can buy this item
        if(this.items[this.selectedItemIndex].canBeBought()){
            // Add the buying button
            this.renderArea.addAsciiRealButton(Database.getText(this.items[this.selectedItemIndex].getButtonText()), 45 - Math.floor(Database.getText(this.items[this.selectedItemIndex].getButtonText()).length/2), yPos + 2, this.items[this.selectedItemIndex].getButtonName() + "BuyingButton", Database.getTranslatedText(this.items[this.selectedItemIndex].getButtonText()), true);

            // Add the link
            this.renderArea.addLinkCall("." + this.items[this.selectedItemIndex].getButtonName() + "BuyingButton", new CallbackCollection(this.buySelectedItem.bind(this)));
        }
    }
    
    private drawSpeech(speechName: string): number{
        return this.renderArea.drawSpeech(Database.getText(speechName), 3, 30, 60, "secondHouseMerchantSpeech", Database.getTranslatedText(speechName));
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the village button
        this.addBackToTheVillageButton(this.renderArea, "secondHouseBackToTheVillageButton");
        
        // Draw the house
        this.renderArea.drawArray(Database.getAscii("places/village/secondHouse"), 0, 3);
        
        // Draw items
        this.drawItems();
        
        // Should we draw the intro speech ?
        if(this.shouldDrawIntroSpeech)
            this.drawIntroSpeech();
        
        // If there's a selected item, draw the stuff related to it (speech and possibly buying button)
        if(this.selectedItemIndex != null){
            this.drawSelectedItemStuff();
        }
    }
}