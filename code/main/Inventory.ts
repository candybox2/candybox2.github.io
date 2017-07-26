///<reference path="Place.ts"/>

class Inventory extends Place{
    // Render area
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the area
        this.renderArea.resize(99, 136);
        
        // Update
        this.update();
    }
    
    // Public methods
    public update(): void{
        // yGap, can increase depending on the stats panel
        var yGap: number = 0;
        
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Draw the inventory top
        this.renderArea.drawArray(Database.getAscii("general/inventoryTop"));
        
        // Draw equipment
        this.drawEquipment();
        
        // Draw statistics
        yGap += this.drawStats(0, 52);
        
        // Draw the inventory bottom
        this.renderArea.drawArray(Database.getAscii("general/inventoryBottom"), 0, 55 + yGap);
        
        // Draw items
        this.drawGridItems(4, 57 + yGap);
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private createArrayFromEqItemsArrayForRenderAreaList(eqItemsArray: { [s: string]: EqItem; }, nothingId: string): string[]{
        // Create the array
        var arr: string[] = [];

        // Add the "Nothing" item
        arr.push(nothingId);
        arr.push(Database.getText("inventorySpecialNothingEqItem") + (Database.getTranslatedText("inventorySpecialNothingEqItem") == ""? "": " (" + Database.getTranslatedText("inventorySpecialNothingEqItem") + ")"));
        
        // Fill the array with eqItems
        for(var savingName in eqItemsArray){
            if(eqItemsArray[savingName].isPossessed()){
                arr.push(savingName);
                arr.push(Database.getText(eqItemsArray[savingName].getDatabaseName()) + (Database.getTranslatedText(eqItemsArray[savingName].getDatabaseName()) == ""? "": " (" + Database.getTranslatedText(eqItemsArray[savingName].getDatabaseName()) + ")"));
            }
        }
        
        // Return the array
        return arr;
    }
    
    private disableAllLists(): void{
        $("#inventoryWeaponsList").prop("disabled", true);
        $("#inventoryHatsList").prop("disabled", true);
        $("#inventoryBodyArmoursList").prop("disabled", true);
        $("#inventoryGlovesList").prop("disabled", true);
        $("#inventoryBootsList").prop("disabled", true);
    }
    
    private drawEqItem(eqItem: EqItem, pos: Pos, size: Pos){
        // If the eqItem isn't null
        if(eqItem != null){
            this.renderArea.drawArray(Database.getAscii(eqItem.getAscii()), Math.floor(pos.x + size.x/2 - Database.getAsciiWidth(eqItem.getAscii())/2), Math.floor(pos.y + size.y/2 - Database.getAsciiHeight(eqItem.getAscii())/2), null, eqItem.getSavingName() + "OnHover");
        
            // Add the tooltip
            this.renderArea.addTooltip(eqItem.getSavingName() + "Tooltip",
                                       Database.getText(eqItem.getDatabaseDescriptionName()) + (Database.getTranslatedText(eqItem.getDatabaseDescriptionName()) != ""? "<br/><br/><i>" + Database.getTranslatedText(eqItem.getDatabaseDescriptionName()) + "</i>" : ""));
        
            // Add the link
            this.renderArea.addLinkOnHoverShowTooltip("." + eqItem.getSavingName() + "OnHover", "." + eqItem.getSavingName() + "Tooltip"); 
        }
    }
    
    private drawEquipment(): void{        
        // Add backgrounds and lists
        var arr: string[];
            // Weapon
            arr = this.createArrayFromEqItemsArrayForRenderAreaList(this.getGame().getWeapons(), "inventorySpecialNothingWeapon");
            if(arr.length > 2) this.renderArea.addList(8, 38, 15, "inventoryWeaponsList", new CallbackCollection(this.selectedEqItem.bind(this)), arr);
            
            // Hat
            arr = this.createArrayFromEqItemsArrayForRenderAreaList(this.getGame().getHats(), "inventorySpecialNothingHat");
            if(arr.length > 2){
                this.renderArea.drawArray(Database.getAscii("general/inventoryHat"), 59, 12);
                this.renderArea.addList(61, 93, 14, "inventoryHatsList", new CallbackCollection(this.selectedEqItem.bind(this)), arr);
            }
            
            // Body armour
            arr = this.createArrayFromEqItemsArrayForRenderAreaList(this.getGame().getBodyArmours(), "inventorySpecialNothingBodyArmour");
            if(arr.length > 2){
                this.renderArea.drawArray(Database.getAscii("general/inventoryBodyArmour"), 59, 25);
                this.renderArea.addList(61, 78, 27, "inventoryBodyArmoursList", new CallbackCollection(this.selectedEqItem.bind(this)), arr);
            }
            
            // Gloves
            arr = this.createArrayFromEqItemsArrayForRenderAreaList(this.getGame().getGloves(), "inventorySpecialNothingGloves");
            if(arr.length > 2){
                this.renderArea.drawArray(Database.getAscii("general/inventoryGloves"), 82, 25);
                this.renderArea.addList(84, 93, 27, "inventoryGlovesList", new CallbackCollection(this.selectedEqItem.bind(this)), arr);
            }
            
            // Boots
            arr = this.createArrayFromEqItemsArrayForRenderAreaList(this.getGame().getBoots(), "inventorySpecialNothingBoots");
            if(arr.length > 2){
                this.renderArea.drawArray(Database.getAscii("general/inventoryBoots"), 59, 38);
                this.renderArea.addList(61, 93, 40, "inventoryBootsList", new CallbackCollection(this.selectedEqItem.bind(this)), arr);
            }
    
        // Add links which will call callbacks after the html dom is created
        this.renderArea.addLinkCallbackCollection(new CallbackCollection(this.selectRightEqItems.bind(this))); // Select the right items
        if(this.getGame().getWeAreQuesting() == true) this.renderArea.addLinkCallbackCollection(new CallbackCollection(this.disableAllLists.bind(this))); // Disable all the lists
    
        // Draw the eqItems
        this.drawEqItem(this.getGame().getSelectedEqItems()["weapon"], new Pos(7, 16), new Pos(32, 33));
        this.drawEqItem(this.getGame().getSelectedEqItems()["hat"], new Pos(60, 16), new Pos(34, 8));
        this.drawEqItem(this.getGame().getSelectedEqItems()["bodyArmour"], new Pos(60, 28), new Pos(19, 8));
        this.drawEqItem(this.getGame().getSelectedEqItems()["gloves"], new Pos(83, 28), new Pos(11, 8));
        this.drawEqItem(this.getGame().getSelectedEqItems()["boots"], new Pos(60, 41), new Pos(34, 8));
    }
    
    private drawGridItem(gridItem: GridItem, x: number, y: number){
        // Draw the ascii art
        this.renderArea.drawArray(Database.getAscii(gridItem.getAscii()), x + gridItem.getPosition().x * 23 + Math.floor(23/2 - Database.getAsciiWidth(gridItem.getAscii())/2), y + gridItem.getPosition().y * 12 + Math.floor(11/2 - Database.getAsciiHeight(gridItem.getAscii())/2), null, gridItem.getSavingName() + "OnHover");
        
        // Add the tooltip
        this.renderArea.addTooltip(gridItem.getSavingName() + "Tooltip",
                                   "<b>" + Database.getText(gridItem.getDatabaseName()) + "</b><br/>" + Database.getText(gridItem.getDatabaseDescriptionName()) + (Database.getTranslatedText(gridItem.getDatabaseDescriptionName()) != ""? "<br/><br/><i><b>" + Database.getTranslatedText(gridItem.getDatabaseName()) + "</b><br/>" + Database.getTranslatedText(gridItem.getDatabaseDescriptionName()) + "</i>" : ""));
        
        // Add the link
        this.renderArea.addLinkOnHoverShowTooltip("." + gridItem.getSavingName() + "OnHover", "." + gridItem.getSavingName() + "Tooltip");
    }
    
    private drawGridItems(x: number, y: number): void{
        for(var savingName in this.getGame().getGridItems()){
            // If we possess this item, we draw it
            if(this.getGame().getGridItems()[savingName].isPossessed())
                this.drawGridItem(this.getGame().getGridItems()[savingName], x, y);
        }
    }
    
    private drawStats(x: number, y: number): number{
        // Set the additional damage text
        var additionalDamageText: string;
        if(Saving.loadBool("gridItemPossessedXinopherydonClaw") && (this.getGame().getSelectedEqItems()["bodyArmour"] != null && this.getGame().getSelectedEqItems()["bodyArmour"].getSavingName() == "eqItemBodyArmoursEnchantedKnightBodyArmour")) // If we have the armour en the claw
            additionalDamageText = "";
        else if(Saving.loadBool("gridItemPossessedXinopherydonClaw")) // Else, if we just have the claw
            additionalDamageText = " x 2";
        else if((this.getGame().getSelectedEqItems()["bodyArmour"] != null && this.getGame().getSelectedEqItems()["bodyArmour"].getSavingName() == "eqItemBodyArmoursEnchantedKnightBodyArmour")) // Else, if we just have the armour
            additionalDamageText = " / 2";
        else // Else, we have nothing special
            additionalDamageText = "";
        
        // This array will contain the special abilities
        var specialAbilities: string[] = [];
        
        // First line
        this.renderArea.drawString(this.getGame().getPlayer().getMaxHp().toString(), x+16, y); // player's maximum HP
        this.renderArea.drawString(this.getGame().getPlayer().getQuestEntityWeapon().getRealDamageText() + additionalDamageText, x+43, y); // weapon damage
        this.renderArea.drawString(this.getGame().getPlayer().getQuestEntityWeapon().getSpeedText(), x+71, y); // weapon speed
        
        // Fill the special abilities array with grid items abilities
        for(var savingName in this.getGame().getGridItems()){
            // If we possess this item
            if(this.getGame().getGridItems()[savingName].isPossessed()){
                // If it has a special ability, we add it
                if(this.getGame().getGridItems()[savingName].getSpecialAbility() != null)
                    specialAbilities.push(this.getGame().getGridItems()[savingName].getSpecialAbility());
            }
        }
        
        // Fill the special abilities array with eq items abilities
        if(this.getGame().getSelectedEqItems()["weapon"] != null && this.getGame().getSelectedEqItems()["weapon"].getSpecialAbility() != null) specialAbilities.push(this.getGame().getSelectedEqItems()["weapon"].getSpecialAbility());
        if(this.getGame().getSelectedEqItems()["hat"] != null && this.getGame().getSelectedEqItems()["hat"].getSpecialAbility() != null) specialAbilities.push(this.getGame().getSelectedEqItems()["hat"].getSpecialAbility());
        if(this.getGame().getSelectedEqItems()["bodyArmour"] != null && this.getGame().getSelectedEqItems()["bodyArmour"].getSpecialAbility() != null) specialAbilities.push(this.getGame().getSelectedEqItems()["bodyArmour"].getSpecialAbility());
        if(this.getGame().getSelectedEqItems()["gloves"] != null && this.getGame().getSelectedEqItems()["gloves"].getSpecialAbility() != null) specialAbilities.push(this.getGame().getSelectedEqItems()["gloves"].getSpecialAbility());
        if(this.getGame().getSelectedEqItems()["boots"] != null && this.getGame().getSelectedEqItems()["boots"].getSpecialAbility() != null) specialAbilities.push(this.getGame().getSelectedEqItems()["boots"].getSpecialAbility());
        
        // Fill the special abilities with gifts
        if(Saving.loadNumber("gameGiftPower") > 0){
            specialAbilities.push("GIFT : your attacks are " + (Saving.loadNumber("gameGiftPower")*20).toString() + "% more powerful.");
        }
        if(Saving.loadNumber("gameGiftHealth") > 0){
            specialAbilities.push("GIFT : you have " + (Saving.loadNumber("gameGiftHealth")*20).toString() + "% more health points.");
        }
        if(Saving.loadNumber("gameGiftMagic") > 0){
            specialAbilities.push("GIFT : the spell and potion countdowns are reduced by " + (Saving.loadNumber("gameGiftMagic")*15) + "%.");
        }
        
        // If the special abilities array is empty, add the "no special ability" text
        if(specialAbilities.length == 0)
            specialAbilities.push("You have no special ability.");
        
        // Draw the special abilities
        for(var i = 0; i < specialAbilities.length; i++){
            // If it's not the first one, we draw the background
            if(i != 0){
                this.renderArea.drawArray(Database.getAscii("general/specialAbilityBackground"), x, y+2+i);
            }
            
            // We draw the special ability
            this.renderArea.drawString(specialAbilities[i], x+7, y+2+i);
        }
        
        // We return the height added by the drawing of the special abilities
        return specialAbilities.length-1;
    }
    
    private selectedEqItem(): void{
        // Set the eqItems
        if($("#inventoryWeaponsList").length) Saving.saveString("gameWeaponSelected", $("#inventoryWeaponsList").find(":selected").attr("id"));
        else Saving.saveString("gameWeaponSelected", "inventorySpecialNothingWeapon");
            
        if($("#inventoryHatsList").length) Saving.saveString("gameHatSelected", $("#inventoryHatsList").find(":selected").attr("id"));
        else Saving.saveString("gameHatSelected", "inventorySpecialNothingHat");
                               
        if($("#inventoryBodyArmoursList").length) Saving.saveString("gameBodyArmourSelected", $("#inventoryBodyArmoursList").find(":selected").attr("id"));
        else Saving.saveString("gameBodyArmourSelected", "inventorySpecialNothingBodyArmour");
                               
        if($("#inventoryGlovesList").length) Saving.saveString("gameGlovesSelected", $("#inventoryGlovesList").find(":selected").attr("id"));
        else Saving.saveString("gameGlovesSelected", "inventorySpecialNothingGloves");
                               
        if($("#inventoryBootsList").length) Saving.saveString("gameBootsSelected", $("#inventoryBootsList").find(":selected").attr("id"));
        else Saving.saveString("gameBootsSelected", "inventorySpecialNothingBoots");
        
        // Fill the selected eqItems array
        this.getGame().emptyAndFillSelectedEqItemsArray();
        
        // Re calculate the player max hp, because it may have changed
        this.getGame().getPlayer().reCalcMaxHp();
        
        // Update inventory
        this.update();
        this.getGame().updatePlace();
    }
    
    private selectRightEqItems(): void{
        // We select the right eqItems
        $("#" + Saving.loadString("gameWeaponSelected")).prop('selected', true);
        $("#" + Saving.loadString("gameHatSelected")).prop('selected', true);
        $("#" + Saving.loadString("gameBodyArmourSelected")).prop('selected', true);
        $("#" + Saving.loadString("gameGlovesSelected")).prop('selected', true);
        $("#" + Saving.loadString("gameBootsSelected")).prop('selected', true);
    }
}