///<reference path="Place.ts"/>
///<reference path="RenderLocation.ts"/>
///<reference path="RenderArea.ts"/>
///<reference path="Resource.ts"/>

// Config
Saving.registerBool("gameDebug", false);
Saving.registerString("gameLanguage", "en");
Saving.registerBool("gameInvertedColors", false);

// EqItems
Saving.registerString("gameWeaponSelected", "inventorySpecialNothingWeapon");
Saving.registerString("gameHatSelected", "inventorySpecialNothingHat");
Saving.registerString("gameBodyArmourSelected", "inventorySpecialNothingBodyArmour");
Saving.registerString("gameGlovesSelected", "inventorySpecialNothingGloves");
Saving.registerString("gameBootsSelected", "inventorySpecialNothingBoots");

// Stuff about gaining lollipops each second
Saving.registerNumber("gameSecondsElapsedSinceLastLollipopsProduction", 0);

// Resources
Saving.registerNumber("gameCandiesAccumulated", 0);
Saving.registerNumber("gameCandiesCurrent", 0);
Saving.registerNumber("gameCandiesMax", 0);

Saving.registerNumber("gameLollipopsAccumulated", 0);
Saving.registerNumber("gameLollipopsCurrent", 0);
Saving.registerNumber("gameLollipopsMax", 0);

Saving.registerNumber("gameChocolateBarsAccumulated", 0);
Saving.registerNumber("gameChocolateBarsCurrent", 0);
Saving.registerNumber("gameChocolateBarsMax", 0);

Saving.registerNumber("gamePainsAuChocolatAccumulated", 0);
Saving.registerNumber("gamePainsAuChocolatCurrent", 0);
Saving.registerNumber("gamePainsAuChocolatMax", 0);

Saving.registerNumber("gameCandiesEatenAccumulated", 0);
Saving.registerNumber("gameCandiesEatenCurrent", 0);
Saving.registerNumber("gameCandiesEatenMax", 0);

Saving.registerNumber("gameCandiesThrownAccumulated", 0);
Saving.registerNumber("gameCandiesThrownCurrent", 0);
Saving.registerNumber("gameCandiesThrownMax", 0);

Saving.registerNumber("gameCandiesUsedToRequestFeaturesAccumulated", 0);
Saving.registerNumber("gameCandiesUsedToRequestFeaturesCurrent", 0);
Saving.registerNumber("gameCandiesUsedToRequestFeaturesMax", 0);

Saving.registerNumber("gameCandiesInCauldronAccumulated", 0);
Saving.registerNumber("gameCandiesInCauldronCurrent", 0);
Saving.registerNumber("gameCandiesInCauldronMax", 0);

Saving.registerNumber("gameLollipopsInCauldronAccumulated", 0);
Saving.registerNumber("gameLollipopsInCauldronCurrent", 0);
Saving.registerNumber("gameLollipopsInCauldronMax", 0);

// Gifts
Saving.registerNumber("gameGiftPower", 0);
Saving.registerNumber("gameGiftHealth", 0);
Saving.registerNumber("gameGiftMagic", 0);

// The gamemode
Saving.registerString("gameGameMode", "normal");

class Game{    
    // Render locations
    private statusBarLocation: RenderLocation = new RenderLocation("#statusBar");
    private mainContentLocation: RenderLocation = new RenderLocation("#mainContent");
    
    // Status bar
    private statusBar: StatusBar;
    
    // Base resources
    private candies: Candies;
    private lollipops: Lollipops;
    private chocolateBars: ChocolateBars;
    private painsAuChocolat: PainsAuChocolat;
    
    // Special resources
    private candiesEaten: CandiesEaten;
    private candiesThrown: CandiesThrown;
    private candiesUsedToRequestFeatures: Resource = new Resource("gameCandiesUsedToRequestFeatures");
    private candiesInCauldron: Resource = new Resource("gameCandiesInCauldron");
    private lollipopsInCauldron: Resource = new Resource("gameLollipopsInCauldron");
    
    // Grid items
    private gridItems: { [s: string]: GridItem; } = {};
    
    // EqItems
    private weapons: { [s: string]: EqItem; } = {};
    private hats: { [s: string]: EqItem; } = {};
    private bodyArmours: { [s: string]: EqItem; } = {};
    private gloves: { [s: string]: EqItem; } = {};
    private boots: { [s: string]: EqItem; } = {};
    
    // EqItems selected from the various arrays above (the selection being made in the inventory tab)
    private selectedEqItems: { [s: string]: EqItem; } = {};
    
    // The quest log
    private questLog: QuestLog = new QuestLog();
    
    // Locations
    private place: Place = null;
    private savedPlace: Place = null;
    
    // Hotkeys
    private hotkeys: { [s: string]: Hotkey;} = {}; // Hotkeys used by the places
    private specialHotkeys: Hotkey[] = []; // Special hotkeys, not linked to the places we visit (used to switch tabs, for example)
    
    // The player
    private player: Player;
    
    // Some info bools
    private weAreQuesting: boolean = false;
    
    // Callbacks
    private oneSecondCallbackCollection: CallbackCollection = new CallbackCollection();
    private questCallbackCollection: CallbackCollection = new CallbackCollection();
    
    // Is the quest slowed down ?
    private questSlowedDown: boolean = false;
    
    // A special number used to slow down the quest callback precisely
    private questSpeedUp: number;
    
    // Local autosave
    private localAutosaveEnabled: boolean = false;
    private localAutosaveSlot: string = null;
    private localAutosaveTime: number = null; // Time in seconds before the next save
    
    // Store the one second interval id (to clear it when we'll load our save from a file)
    private oneSecondIntervalId: number;
    
    // Is the status bar allowed to use the n key to go to the next tab? (this is set to false when using the computer...)
    private isStatusBarAllowedToUseTheNKey: boolean = true;
    
    // Constructor
    constructor(gameMode: string){
        // We save the game mode given in parameter
        if(gameMode != null) Saving.saveString("gameGameMode", gameMode);
        
        // We create the grid items
        this.createGridItems();
        
        // We create the eqItems
        this.createEqItems();
        
        // We create the status bar
        this.statusBar = new StatusBar(this, 0);
        
        // We create the player
        this.player = new Player(this);
        
        // We create the resources
        this.candies = new Candies(this, "gameCandies");
        this.lollipops = new Lollipops(this, "gameLollipops");
        this.chocolateBars = new ChocolateBars(this, "gameChocolateBars");
        this.painsAuChocolat = new PainsAuChocolat(this, "gamePainsAuChocolat");
        this.candiesEaten = new CandiesEaten(this, "gameCandiesEaten");
        this.candiesThrown = new CandiesThrown(this, "gameCandiesThrown");
        
        // We update the status bar
        this.updateStatusBar();
        
        // We launch timeouts & intervals methods
        this.oneSecondIntervalId = window.setInterval(this.oneSecondMethod.bind(this), 1000);
        window.setTimeout(this.questMethod.bind(this), 100);
    }
    
    // Public methods
    public addHotkey(hotkey: Hotkey){
        this.hotkeys[hotkey.getKeyString()] = hotkey;
    }
    
    public addSpecialHotkey(hotkey: Hotkey){
        this.specialHotkeys.push(hotkey);
    }
    
    public applyInvertedColorsToCss(): void{
        if(Saving.loadBool("gameInvertedColors") == false)
            $('#invertColorsStylesheet').remove();
        else
            $('head').append('<link href="css/invertColors.css" rel="stylesheet" id="invertColorsStylesheet"/>');
    }
    
    public calcLollipopFarmProduction(): void{
        // Is the production each second ?
        Saving.saveBool("lollipopFarmIsProductionEachSecond", this.isLollipopFarmProductionEachSecond());
        
        // If we produce x lollipops each second
        if(Saving.loadBool("lollipopFarmIsProductionEachSecond")){
            Saving.saveNumber("lollipopFarmProduction", (Saving.loadBool("gridItemPossessedShellPowder")? 3:1)*
                                                        (Saving.loadBool("gridItemPossessedPitchfork")? 3:1)*
                                                        (Saving.loadBool("gridItemPossessedGreenSharkFin")? 5:1)*
                                                        Math.ceil(100*(1-Math.exp(-(Saving.loadNumber("lollipopFarmLollipopsPlanted")-20)/5000))));
        }
        // Else
        else{
            switch(Saving.loadNumber("lollipopFarmLollipopsPlanted")){
                case 1: Saving.saveNumber("lollipopFarmProduction", 3600*8); break;
                case 2: Saving.saveNumber("lollipopFarmProduction", 3600*5); break;
                case 3: Saving.saveNumber("lollipopFarmProduction", 3600*2); break;
                case 4: Saving.saveNumber("lollipopFarmProduction", 3600); break;
                case 5: Saving.saveNumber("lollipopFarmProduction", 60*40); break;
                case 6: Saving.saveNumber("lollipopFarmProduction", 60*25); break;
                case 7: Saving.saveNumber("lollipopFarmProduction", 60*12); break;
                case 8: Saving.saveNumber("lollipopFarmProduction", 60*8); break;
                case 9: Saving.saveNumber("lollipopFarmProduction", 60*5); break;
                case 10: Saving.saveNumber("lollipopFarmProduction", 60*2); break;
                case 11: Saving.saveNumber("lollipopFarmProduction", 60); break;
                case 12: Saving.saveNumber("lollipopFarmProduction", 52); break;
                case 13: Saving.saveNumber("lollipopFarmProduction", 42); break;
                case 14: Saving.saveNumber("lollipopFarmProduction", 30); break;
                case 15: Saving.saveNumber("lollipopFarmProduction", 16); break;
                case 16: Saving.saveNumber("lollipopFarmProduction", 8); break;
                case 17: Saving.saveNumber("lollipopFarmProduction", 5); break;
                case 18: Saving.saveNumber("lollipopFarmProduction", 4); break;
                case 19: Saving.saveNumber("lollipopFarmProduction", 3); break;
                case 20: Saving.saveNumber("lollipopFarmProduction", 2); break;
            }
        }
    }
    
    public canStartQuest(): boolean{
        if(this.player.getHp() == 0)
            return false;
        
        return true;
    }
    
    public clearAllIntervals(): void{
        clearInterval(this.oneSecondIntervalId);
    }
    
    public disableLocalAutosave(): void{
        this.localAutosaveEnabled = false;
        this.localAutosaveSlot = null;
    }
    
    public emptyAndFillSelectedEqItemsArray(): void{
        // Empty
        this.selectedEqItems = {};
        
        // Fill
        if(Saving.loadString("gameWeaponSelected") != "inventorySpecialNothingWeapon") this.selectedEqItems["weapon"] = this.weapons[Saving.loadString("gameWeaponSelected")];
        if(Saving.loadString("gameHatSelected") != "inventorySpecialNothingHat") this.selectedEqItems["hat"] = this.hats[Saving.loadString("gameHatSelected")];
        if(Saving.loadString("gameBodyArmourSelected") != "inventorySpecialNothingBodyArmour") this.selectedEqItems["bodyArmour"] = this.bodyArmours[Saving.loadString("gameBodyArmourSelected")];
        if(Saving.loadString("gameGlovesSelected") != "inventorySpecialNothingGloves") this.selectedEqItems["gloves"] = this.gloves[Saving.loadString("gameGlovesSelected")];
        if(Saving.loadString("gameBootsSelected") != "inventorySpecialNothingBoots") this.selectedEqItems["boots"] = this.boots[Saving.loadString("gameBootsSelected")];
    }
    
    public enableLocalAutosave(localAutosaveSlot: string): void{
        this.localAutosaveEnabled = true;
        this.localAutosaveSlot = localAutosaveSlot;
        this.setDefaultLocalAutosaveTime();
    }
    
    public gainItem(itemSavingName): void{
        Saving.saveBool(itemSavingName, true);
        
        this.player.reCalcMaxHp(); // We re calc the player max hp just in case
        this.calcLollipopFarmProduction(); // Idem for the farm production
    }
    
    public getEqItemFromEqItemType(savingName: string, type: EqItemType): EqItem{
        switch(type){
            case EqItemType.WEAPON: return this.weapons[savingName]; break;
            case EqItemType.HAT: return this.hats[savingName]; break;
            case EqItemType.BODYARMOUR: return this.bodyArmours[savingName]; break;
            case EqItemType.GLOVES: return this.gloves[savingName]; break;
            case EqItemType.BOOTS: return this.boots[savingName]; break;
        }
    }
    
    public isEquipped(type: string, savingName: string): boolean{
        if(this.selectedEqItems[type] == undefined || this.selectedEqItems[type] == null)
            return false;
        
        else return (this.selectedEqItems[type].getSavingName() == savingName);
    }
    
    private isLollipopFarmProductionEachSecond(): boolean{
        if(Saving.loadNumber("lollipopFarmLollipopsPlanted") > 20){
            return true;
        }
        
        return false;
    }
    
    public load(): void{
        // Resources
        this.candies.load();
        this.lollipops.load();
        this.chocolateBars.load();
        this.painsAuChocolat.load();
        this.candiesEaten.load();
        this.candiesThrown.load();
        this.candiesUsedToRequestFeatures.load();
        this.candiesInCauldron.load();
        this.lollipopsInCauldron.load();
        
        // Handle inverted colors (we have to change the css now depending on the gameInvertedColors bool from the Saving module)
        this.applyInvertedColorsToCss();
    }
    
    public postLoad(): void{
        // We re calc the player hp
        this.player.reCalcMaxHp();
        
        // We update the status bar
        this.updateStatusBar(true);
        
        // Select correct items
        this.emptyAndFillSelectedEqItemsArray();
        
        // We go to the candy box
        this.goToCandyBox();
        
        // And we set the saved place (the village)
        this.savedPlace = new Village(this);
    }
    
    public resetPlayer(): void{
        // Save some important things
        var hp: number = this.player.getHp();
        var maxHp: number = this.player.getMaxHp();
        
        // Re-create the player
        this.player = new Player(this);
        
        // Restore the important things saved
        this.player.setHp(hp);
        this.player.setMaxHp(maxHp);
    }
    
    public resetSpecialHotkeys(): void{
        this.specialHotkeys = [];
    }
    
    public save(): void{
        // Resources
        this.candies.save();
        this.lollipops.save();
        this.chocolateBars.save();
        this.painsAuChocolat.save();
        this.candiesEaten.save();
        this.candiesThrown.save();
        this.candiesUsedToRequestFeatures.save();
        this.candiesInCauldron.save();
        this.lollipopsInCauldron.save();
    }
    
    public setPlace(place: Place): void{
        // If the current place isn't null, we warn it that we're going to stop displaying it
        if(this.place != null){
            this.place.willStopBeingDisplayed();
            this.resetHotkeys();
            // If we didn't save this place we're not displaying anymore
            if(this.savedPlace == null){
                // It means we're closing it actually, so we tell it that we're closing it
                this.place.willBeClosed();
            }
        }
        
        // Set the place
        this.place = place;
        
        // Callbacks
        this.resetResourcesCallbacks();
        this.place.willBeDisplayed();
        
        // Display the place for the first time
        this.displayPlace();
    }
    
    public unequipIfEquipped(savingName: string, type: EqItemType): void{
        switch(type){
            case EqItemType.WEAPON: if(this.selectedEqItems["weapon"] != null && this.selectedEqItems["weapon"].getSavingName() == savingName) Saving.saveString("gameWeaponSelected", "inventorySpecialNothingWeapon"); break;
            case EqItemType.HAT: if(this.selectedEqItems["hat"] != null && this.selectedEqItems["hat"].getSavingName() == savingName) Saving.saveString("gameHatSelected", "inventorySpecialNothingHat"); break;
            case EqItemType.BODYARMOUR: if(this.selectedEqItems["bodyArmour"] != null && this.selectedEqItems["bodyArmour"].getSavingName() == savingName) Saving.saveString("gameBodyArmourSelected", "inventorySpecialNothingBodyArmour"); break;
            case EqItemType.GLOVES: if(this.selectedEqItems["gloves"] != null && this.selectedEqItems["gloves"].getSavingName() == savingName) Saving.saveString("gameGlovesSelected", "inventorySpecialNothingGloves"); break;
            case EqItemType.BOOTS: if(this.selectedEqItems["boots"] != null && this.selectedEqItems["boots"].getSavingName() == savingName) Saving.saveString("gameBootsSelected", "inventorySpecialNothingBoots"); break;
        }
        
        this.emptyAndFillSelectedEqItemsArray();
    }
    
    public updatePlace(): void{
        this.displayPlace();
    }
    
    public updateStatusBar(reAdd: boolean = false): void{
        if(reAdd) this.statusBar.deleteAndReAddEverything();
        this.statusBar.updateAll();
        this.statusBarLocation.render(this.statusBar.getRenderArea());
    }
    
    // "go to" methods
    public goToCandyBox(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new CandyBox(this));
    }
    
    public goToCastle(): void{
        this.setPlace(new Castle(this));
    }
    
    public goToCastleEntrance(): void{
        this.setPlace(new CastleEntrance(this));
    }
    
    public goToCauldron(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new Cauldron(this));
    }
    
    public goToCfg(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new Cfg(this));
    }
    
    public goToInsideFortress(): void{
        this.setPlace(new InsideFortress(this));
    }
    
    public goToInsideYourBox(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new InsideYourBox(this));
    }
    
    public goToInventory(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new Inventory(this));
    }
    
    public goToLighthouse(): void{
        this.setPlace(new Lighthouse(this));
    }
    
    public goToLollipopFarm(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new LollipopFarm(this));
    }
    
    public goToMainMap(): void{
        this.setPlace(new MainMap(this));
    }
    
    public goToMap(): void{
        this.setPlaceFromSavedMapPlace();
    }
    
    public goToSave(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new Save(this));
    }
    
    public goToSorceressHut(): void{
        this.setPlace(new SorceressHut(this));
    }
    
    public goToTheArena(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new TheArena(this));
    }
    
    public goToTheCave(): void{
        this.setPlace(new TheCave(this));
    }
    
    public goToTheComputer(): void{
        this.saveCurrentMapPlace();
        this.setPlace(new TheComputer(this));
    }
    
    public goToVillage(): void{
        this.setPlace(new Village(this));
    }
    
    public goToYourself(): void{
        this.setPlace(new Yourself(this));
    }
    
    // Public getters
    public getBodyArmours(): { [s: string]: EqItem; }{
        return this.bodyArmours;
    }
    
    public getBoots(): { [s: string]: EqItem; }{
        return this.boots;
    }
    
    public getCandies(): Candies{
        return this.candies;
    }
    
    public getCandiesEaten(): CandiesEaten{
        return this.candiesEaten;
    }
    
    public getCandiesInCauldron(): Resource{
        return this.candiesInCauldron;
    }
    
    public getCandiesThrown(): CandiesThrown{
        return this.candiesThrown;
    }
    
    public getCandiesUsedToRequestFeatures(): Resource{
        return this.candiesUsedToRequestFeatures;
    }
    
    public getChocolateBars(): ChocolateBars{
        return this.chocolateBars;
    }
    
    public getGloves(): { [s: string]: EqItem; }{
        return this.gloves;
    }
    
    public getHats(): { [s: string]: EqItem; }{
        return this.hats;
    }
    
    public getHotkeys(): { [s: string]: Hotkey;}{
        return this.hotkeys;
    }
    
    public getGridItems(): { [s: string]: GridItem; }{
        return this.gridItems;
    }
    
    public getIsStatusBarAllowedToUseTheNKey(): boolean{
        return this.isStatusBarAllowedToUseTheNKey;
    }
    
    public getLocalAutosaveEnabled(): boolean{
        return this.localAutosaveEnabled;
    }
    
    public getLocalAutosaveSlot(): string{
        return this.localAutosaveSlot;
    }
    
    public getLocalAutosaveTime(): number{
        return this.localAutosaveTime;
    }
    
    public getLollipops(): Lollipops{
        return this.lollipops;
    }
    
    public getLollipopsInCauldron(): Resource{
        return this.lollipopsInCauldron;
    }
    
    public getPainsAuChocolat(): PainsAuChocolat{
        return this.painsAuChocolat;
    }
    
    public getQuestCallbackCollection(): CallbackCollection{
        return this.questCallbackCollection;
    }
    
    public getQuestLog(): QuestLog{
        return this.questLog;
    }
    
    public getQuestSlowedDown(): boolean{
        return this.questSlowedDown;
    }
    
    public getQuestSpeedUp(): number{
        return this.questSpeedUp;
    }
    
    public getOneSecondCallbackCollection(): CallbackCollection{
        return this.oneSecondCallbackCollection;
    }
    
    public getPlayer(): Player{
        return this.player;
    }
    
    public getMainContentLocation(): RenderLocation{
        return this.mainContentLocation;
    }
    
    public getSelectedEqItems(): { [s: string]: EqItem; }{
        return this.selectedEqItems;
    }
    
    public getSpecialHotkeys(): Hotkey[]{
        return this.specialHotkeys;
    }
    
    public getStatusBar(): StatusBar{
        return this.statusBar;
    }
    
    public getWeapons(): { [s: string]: EqItem; }{
        return this.weapons;
    }
    
    public getWeAreQuesting(): boolean{
        return this.weAreQuesting;
    }
    
    // Public setters
    public setIsStatusBarAllowedToUseTheNKey(isStatusBarAllowedToUseTheNKey: boolean): void{
        this.isStatusBarAllowedToUseTheNKey = isStatusBarAllowedToUseTheNKey;
    }
    
    public setQuestSlowedDown(questSlowedDown: boolean): void{
        this.questSlowedDown = questSlowedDown;
    }
    
    public setQuestSpeedUp(questSpeedUp: number): void{
        this.questSpeedUp = questSpeedUp;
    }
    
    public setWeAreQuesting(weAreQuesting: boolean): void{
        this.weAreQuesting = weAreQuesting;
    }
    
    // Private methods
    private addEqItem(eqItem: EqItem, array: { [s: string]: EqItem; }): void{
        array[eqItem.getSavingName()] = eqItem;
    }
    
    private addGridItem(gridItem: GridItem): void{
        this.gridItems[gridItem.getSavingName()] = gridItem;
    }
    
    private createEqItems(): void{
        // Create weapons
        this.addEqItem(new WoodenSword(), this.weapons);
        this.addEqItem(new IronAxe(), this.weapons);
        this.addEqItem(new PolishedSilverSword(), this.weapons);
        this.addEqItem(new TrollBludgeon(), this.weapons);
        this.addEqItem(new MonkeyWizardStaff(), this.weapons);
        this.addEqItem(new EnchantedMonkeyWizardStaff(), this.weapons);
        this.addEqItem(new TribalSpear(), this.weapons);
        this.addEqItem(new SummoningTribalSpear(), this.weapons);
        this.addEqItem(new GiantSpoon(), this.weapons);
        this.addEqItem(new Scythe(), this.weapons);
        this.addEqItem(new GiantSpoonOfDoom(), this.weapons);
        
        // Create hats
        this.addEqItem(new OctopusKingCrown(), this.hats);
        this.addEqItem(new OctopusKingCrownWithJaspers(), this.hats);
        this.addEqItem(new OctopusKingCrownWithObsidian(), this.hats);
        this.addEqItem(new MerchantHat(), this.hats);
        this.addEqItem(new SorceressHat(), this.hats);
        
        // Create body armours
        this.addEqItem(new LightweightBodyArmour(), this.bodyArmours);
        this.addEqItem(new KnightBodyArmour(), this.bodyArmours);
        this.addEqItem(new EnchantedKnightBodyArmour(), this.bodyArmours);
        
        // Create gloves
        this.addEqItem(new LeatherGloves(), this.gloves);
        this.addEqItem(new RedEnchantedGloves(), this.gloves);
        this.addEqItem(new PinkEnchantedGloves(), this.gloves);
        
        // Create boots
        this.addEqItem(new LeatherBoots(), this.boots);
        this.addEqItem(new RocketBoots(), this.boots);
        this.addEqItem(new BootsOfIntrospection(), this.boots);
    }
    
    private createGridItems(): void{
        // First line
        this.addGridItem(new GridItem("gridItemPossessedMainMap", "gridItemMainMapName", "gridItemMainMapDescription", "gridItems/mainMap", new Pos(0, 0)));
        this.addGridItem(new GridItem("gridItemPossessedTimeRing", "gridItemTimeRingName", "gridItemTimeRingDescription", "gridItems/timeRing", new Pos(1, 0)));
        this.addGridItem(new GridItem("gridItemPossessedThirdHouseKey", "gridItemThirdHouseKeyName", "gridItemThirdHouseKeyDescription", "gridItems/thirdHouseKey", new Pos(2, 0)));
        this.addGridItem(new GridItem("gridItemPossessedBeginnersGrimoire", "gridItemBeginnersGrimoireName", "gridItemBeginnersGrimoireDescription", "gridItems/beginnersGrimoire", new Pos(3, 0)));
        
        // Second line
        this.addGridItem(new Feather("gridItemPossessedFeather", "gridItemFeatherName", "gridItemFeatherDescription", "gridItems/feather", new Pos(0, 1)));
        this.addGridItem(new GridItem("gridItemPossessedPogoStick", "gridItemPogoStickName", "gridItemPogoStickDescription", "gridItems/pogoStick", new Pos(1, 1)));
        this.addGridItem(new GridItem("gridItemPossessedHeartPlug", "gridItemHeartPlugName", "gridItemHeartPlugDescription", "gridItems/heartPlug", new Pos(2, 1)));
        this.addGridItem(new GridItem("gridItemPossessedAdvancedGrimoire", "gridItemAdvancedGrimoireName", "gridItemAdvancedGrimoireDescription", "gridItems/advancedGrimoire", new Pos(3, 1)));
        
        // Third line
        this.addGridItem(new GridItem("gridItemPossessedSponge", "gridItemSpongeName", "gridItemSpongeDescription", "gridItems/sponge", new Pos(0, 2)));
        this.addGridItem(new GridItem("gridItemPossessedShellPowder", "gridItemShellPowderName", "gridItemShellPowderDescription", "gridItems/shellPowder", new Pos(1, 2)));
        this.addGridItem(new GridItem("gridItemPossessedRedSharkFin", "gridItemRedSharkFinName", "gridItemRedSharkFinDescription", "gridItems/redSharkFin", new Pos(2, 2)));
        this.addGridItem(new GridItem("gridItemPossessedBlackMagicGrimoire", "gridItemBlackMagicGrimoireName", "gridItemBlackMagicGrimoireDescription", "gridItems/blackMagicGrimoire", new Pos(3, 2)));
        
        // Fourth line
        this.addGridItem(new GridItem("gridItemPossessedGreenSharkFin", "gridItemGreenSharkFinName", "gridItemGreenSharkFinDescription", "gridItems/greenSharkFin", new Pos(0, 3)));
        this.addGridItem(new GridItem("gridItemPossessedPurpleSharkFin", "gridItemPurpleSharkFinName", "gridItemPurpleSharkFinDescription", "gridItems/purpleSharkFin", new Pos(1, 3)));
        this.addGridItem(new GridItem("gridItemPossessedHeartPendant", "gridItemHeartPendantName", "gridItemHeartPendantDescription", "gridItems/heartPendant", new Pos(2, 3)));
        this.addGridItem(new GridItem("gridItemPossessedFortressKey", "gridItemFortressKeyName", "gridItemFortressKeyDescription", "gridItems/fortressKey", new Pos(3, 3)));
        
        // Fifth line
        this.addGridItem(new UnicornHorn("gridItemPossessedUnicornHorn", "gridItemUnicornHornName", "gridItemUnicornHornDescription", "gridItems/unicornHorn", new Pos(0, 4)));
        this.addGridItem(new XinopherydonClaw("gridItemPossessedXinopherydonClaw", "gridItemXinopherydonClawName", "gridItemXinopherydonClawDescription", "gridItems/xinopherydonClaw", new Pos(1, 4)));
        this.addGridItem(new GridItem("gridItemPossessedPitchfork", "gridItemPitchforkName", "gridItemPitchforkDescription", "gridItems/pitchfork", new Pos(2, 4)));
        this.addGridItem(new GridItem("gridItemPossessedTalkingCandy", "gridItemTalkingCandyName", "gridItemTalkingCandyDescription", "gridItems/talkingCandy", new Pos(3, 4)));
        
        // Sixth line
        this.addGridItem(new GridItem("gridItemPossessedP", "gridItemPName", "gridItemPDescription", "gridItems/p", new Pos(0, 5)));
        this.addGridItem(new GridItem("gridItemPossessedL", "gridItemLName", "gridItemLDescription", "gridItems/l", new Pos(1, 5)));
        this.addGridItem(new GridItem("gridItemPossessedA", "gridItemAName", "gridItemADescription", "gridItems/a", new Pos(2, 5)));
        this.addGridItem(new GridItem("gridItemPossessedY", "gridItemYName", "gridItemYDescription", "gridItems/y", new Pos(3, 5)));
    }
    
    private displayArea(renderArea: RenderArea, scrolling: boolean = false, gap: number = 0, defaultScroll: number = 0): void{
        this.mainContentLocation.render(renderArea);
        this.mainContentLocation.setScrolling(scrolling, defaultScroll);
        if(scrolling == false) this.mainContentLocation.setContentGap(gap);
        else this.mainContentLocation.setContentGap(0);
    }
    
    private displayPlace(): void{
        this.displayArea(this.place.getRenderArea(), this.place.getScrolling(), this.place.getGap(), this.place.getDefaultScroll());
    }
    
    private handleCandiesProduction(): void{
        this.candies.add(Saving.loadNumber("lollipopFarmCurrentCandiesProduction"));
    }
    
    private handleLollipopProduction(): void{
        // If at least one lollipop is planted
        if(Saving.loadNumber("lollipopFarmLollipopsPlanted") > 0){
            // If the production is each second
            if(Saving.loadBool("lollipopFarmIsProductionEachSecond")){
                // We just add the production as lollipops
                this.lollipops.add(Saving.loadNumber("lollipopFarmProduction"));
            }
            // Else
            else{
                // If it's time for a new production
                if(Saving.loadNumber("lollipopFarmTimeSinceLastProduction") >= Saving.loadNumber("lollipopFarmProduction") - 1){
                    // We reset the time
                    Saving.saveNumber("lollipopFarmTimeSinceLastProduction", 0);
                    // We add one lollipop
                    this.lollipops.add(1);
                }
                else{
                    // We increase the time
                    Saving.saveNumber("lollipopFarmTimeSinceLastProduction", Saving.loadNumber("lollipopFarmTimeSinceLastProduction") + 1);
                }
            }
        }
    }
    
    private handlePondConversion(): void{
        // Variables
        var conversionAmount: number;
        
        // If the conversion is activated
        if(Saving.loadBool("lollipopFarmPondFeedingLolligators")){
            // Set the conversion amount
            conversionAmount = Saving.loadNumber("lollipopFarmPondConversionRate");
            // If we don't have enough candies, lower this conversion rate
            if(this.candies.getCurrent() < conversionAmount)
                conversionAmount = this.candies.getCurrent();
            // If the conversionAmount is > 0, we convert
            if(conversionAmount > 0){
                this.candies.add(-conversionAmount);
                this.lollipops.add(conversionAmount);
            }
        }
    }
    
    private localAutosave(): void{
        // If local autosave is enabled and there's a local auto save slot and there's a local autosave time
        if(this.localAutosaveEnabled == true && this.localAutosaveSlot != null && this.localAutosaveTime != null){
            // If it's time to save
            if(this.localAutosaveTime <= 0){
                // We save
                Saving.save(this, MainLoadingType.LOCAL, this.localAutosaveSlot);
                // We reset the time
                this.setDefaultLocalAutosaveTime();
            }
            // Else, we decrease the local autosave time
            else
                this.localAutosaveTime -= 1;
        }
        
    }
    
    private questMethod(): void{
        // Re set the timeout, depending on if the time is slowed down or not
        window.setTimeout(this.questMethod.bind(this), ((this.questSlowedDown && this.weAreQuesting)? 200:100 + this.getQuestSpeedUp()));
        
        // Special place callbacks
        this.questCallbackCollection.fire();
    }
    
    private oneSecondMethod(): void{
        // Our methods
        this.player.magicHealthRegain();
        this.handleCandiesProduction();
        this.handleLollipopProduction();
        this.handlePondConversion();
        this.localAutosave();
        
        // Special place callbacks
        this.oneSecondCallbackCollection.fire();
    }
    
    private resetHotkeys(): void{
        this.hotkeys = {};
    }
    
    private resetResourcesCallbacks(): void{
        // Reset status bar resources callbacks
        this.candies.getCallbackCollection().reset();
        this.lollipops.getCallbackCollection().reset();
        
        // Reset other resources callbacks
        this.candiesEaten.getCallbackCollection().reset();
        this.candiesThrown.getCallbackCollection().reset();
        
        // Reset interval callbacks
        this.oneSecondCallbackCollection.reset();
        this.questCallbackCollection.reset();
    }
    
    private saveCurrentMapPlace(): void{
        if(this.savedPlace == null) this.savedPlace = this.place;
    }
    
    private setDefaultLocalAutosaveTime(): void{
        this.localAutosaveTime = 600;
    }
    
    private setPlaceFromSavedMapPlace(): void{
        // If there's a saved place
        if(this.savedPlace != null){
            this.setPlace(this.savedPlace); // We set the saved place as the current place
            this.savedPlace = null; // There's no saved place anymore
        }
    }
}
