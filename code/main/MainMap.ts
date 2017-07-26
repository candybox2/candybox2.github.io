///<reference path="Place.ts"/>

// The default scroll
Saving.registerNumber("mainMapDefaultScroll", 400);

// Various steps
Saving.registerBool("mainMapDoneDesert", false);
Saving.registerBool("mainMapDoneBridge", false);
Saving.registerBool("mainMapDoneCaveEntrance", false);
Saving.registerBool("mainMapDonePier", false);
Saving.registerBool("mainMapDoneForest", false);
Saving.registerBool("mainMapDoneCastleEntrance", false);

class MainMap extends Place{
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        this.load();
    }
    
    // willStopBeingDisplayed()
    public willStopBeingDisplayed(): void{
        Saving.saveNumber("mainMapDefaultScroll", this.getGame().getMainContentLocation().getScroll());
    }
    
    // Public getters
    public getDefaultScroll(): number{
        return Saving.loadNumber("mainMapDefaultScroll");
    }
    
    public getScrolling(): boolean{
        return true; // Scrolling is enabled
    }
    
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private load(): void{
        // We erase the map
        this.renderArea.resetAllButSize();
        
        // We load the map itself
        this.renderArea.resizeFromArray(Database.getAscii("maps/map"));
        this.renderArea.drawArray(Database.getAscii("maps/map"));
        
        // We add various locations
        this.loadATree(143, 26);
        if(Saving.loadBool("gridItemPossessedFortressKey")) this.loadFortress(117, 39);
        this.loadTheDesert(114, 42);
        this.loadVillage(150, 36);
        this.loadLonelyHouse(159, 23);
        if(Saving.loadBool("TheCavePattern_TreasureMapSawMap") == true && Saving.loadBool("TheCavePattern_TreasureMapFoundTreasure") == false) this.loadTreasure(163, 29);
        if(Saving.loadBool("mainMapDoneDesert")){
            this.loadFarm(115, 57);
            this.loadBridge(99, 61);
            this.loadCaveEntrance(52, 57);
            this.loadWishingWell(55, 66);
            if(Saving.loadBool("gridItemPossessedPogoStick") == false) this.loadMoutains(71, 52);
        }
        if(Saving.loadBool("mainMapDoneBridge")) this.loadSorceressHut(95, 68);
        if(Saving.loadBool("mainMapDoneCaveEntrance")){
            this.loadPier(44, 33);
            this.loadForest(58, 30);
        }
        if(Saving.loadBool("mainMapDonePier")){
            this.loadLighthouse(38, 16);
        }
        if(Saving.loadBool("mainMapDoneForest")){
            this.loadCastleEntrance(88, 25);
            this.loadTheHole(126, 25);
        }
        if(Saving.loadBool("mainMapDoneCastleEntrance")){
            this.loadCastle(87, 17);
        }
        if(Saving.loadBool("dragonDone")){
            this.loadDragon(92, 11);
        }
    }
    
    // Private "go to" methods
    private goToATree(): void{
        this.getGame().setPlace(new ATree(this.getGame()));
    }
    
    private goToBridge(): void{
        if(this.getGame().canStartQuest())
            this.getGame().setPlace(new Bridge(this.getGame()));
    }
    
    private goToCastle(): void{
        this.getGame().goToCastle();
    }
    
    private goToDragon(): void{
        this.getGame().setPlace(new Dragon(this.getGame()));
    }
    
    private goToFarm(): void{
        Saving.saveBool("statusBarUnlockedLollipopFarm", true); // We unlock the farm tab
        this.getGame().updateStatusBar(true); // We update the status bar
        this.getGame().getStatusBar().selectTabByType(StatusBarTabType.FARM); // We select the farm tab
        this.getGame().goToLollipopFarm(); // We show the farm
    }
    
    private goToForest(): void{
        this.getGame().setPlace(new Forest(this.getGame()));
    }
    
    private goToFortress(): void{
        this.getGame().goToInsideFortress();
    }
    
    private goToLighthouse(): void{
        this.getGame().goToLighthouse();
    }
    
    private goToLonelyHouse(): void{
        this.getGame().setPlace(new LonelyHouse(this.getGame()));
    }
    
    private goToMoutains(): void{
        this.getGame().setPlace(new Moutains(this.getGame()));
    }
    
    private goToPier(): void{
        this.getGame().setPlace(new Pier(this.getGame()));
    }
    
    private goToSorceressHut(): void{
        this.getGame().goToSorceressHut();
    }
    
    private goToTheCave(): void{
        this.getGame().goToTheCave();
    }
    
    private goToTheDesert(): void{
        if(this.getGame().canStartQuest())
            this.getGame().setPlace(new Desert(this.getGame()));
    }
    
    private goToTheHole(): void{
        if(this.getGame().canStartQuest())
            this.getGame().setPlace(new OutsideTheHole(this.getGame()));
    }
    
    private goToTreasure(): void{
        this.getGame().setPlace(new Treasure(this.getGame()));
    }
    
    private goToWishingWell(): void{
        this.getGame().setPlace(new WishingWell(this.getGame()));
    }
    
    // Private "load" methods
    private loadATree(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapATreeButton",
            x+2, x+5, y,
            x+1, x+6, y+1,
            x, x+7, y+2,
            x+2, x+5, y+3,
            x+2, x+5, y+4);
        // Comments
        this.renderArea.addFullComment(x - 2, y + 3, Database.getText("mapATreeComment"), Database.getTranslatedText("mapATreeComment"), "mapATreeComment");
        // Interactions
        this.renderArea.addLinkOver(".mapATreeButton, .mapATreeComment", ".mapATreeComment");
        this.renderArea.addLinkCall(".mapATreeButton, .mapATreeComment", new CallbackCollection(this.goToATree.bind(this)));
    }
    
    private loadBridge(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapBridgeButton",
            x, x+3, y,
            x, x+3, y+1,
            x, x+3, y+2,
            x, x+3, y+3,
            x, x+3, y+4,
            x, x+3, y+5);
        // Comments
        this.renderArea.addFullComment(x + 2, y + 2, Database.getText("mapBridgeComment"), Database.getTranslatedText("mapBridgeComment"), "mapBridgeComment");
        // Interactions
        this.renderArea.addLinkOver(".mapBridgeButton, .mapBridgeComment", ".mapBridgeComment");
        this.renderArea.addLinkCall(".mapBridgeButton, .mapBridgeComment", new CallbackCollection(this.goToBridge.bind(this)));
    }
    
    private loadCastle(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapCastleButton",
            x+2, x+4, y,
            x+17, x+19, y,
            x+1, x+3, y+1,
            x+16, x+18, y+1,
            x, x+4, y+2,
            x+15, x+19, y+2,
            x, x+4, y+3,
            x+15, x+19, y+3,
            x, x+19, y+4,
            x, x+19, y+5,
            x, x+19, y+6);
        // Comments
        this.renderArea.addFullComment(x + 25, y + 4, Database.getText("mapCastleComment"), Database.getTranslatedText("mapCastleComment"), "mapCastleComment");
        // Interactions
        this.renderArea.addLinkOver(".mapCastleButton, .mapCastleComment", ".mapCastleComment");
        this.renderArea.addLinkCall(".mapCastleButton, .mapCastleComment", new CallbackCollection(this.goToCastle.bind(this)));
    }
    
    private loadCastleEntrance(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapCastleEntranceButton",
            x+6, x+11, y,
            x+6, x+11, y+1,
            x, x+17, y+2,
            x, x+17, y+3);
        // Comments
        this.renderArea.addFullComment(x + 9, y + 4, Database.getText("mapCastleEntranceComment"), Database.getTranslatedText("mapCastleEntranceComment"), "mapCastleEntranceComment");
        // Interactions
        this.renderArea.addLinkOver(".mapCastleEntranceButton, .mapCastleEntranceComment", ".mapCastleEntranceComment");
        this.renderArea.addLinkCall(".mapCastleEntranceButton, .mapCastleEntranceComment", new CallbackCollection(this.getGame().goToCastleEntrance.bind(this.getGame())));
    }
    
    private loadCaveEntrance(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapCaveEntranceButton",
            x, x+5, y);
        // Comments
        this.renderArea.addFullComment(x + 3, y + 1, Database.getText("mapCaveEntranceComment"), Database.getTranslatedText("mapCaveEntranceComment"), "mapCaveEntranceComment");
        // Interactions
        this.renderArea.addLinkOver(".mapCaveEntranceButton, .mapCaveEntranceComment", ".mapCaveEntranceComment");
        this.renderArea.addLinkCall(".mapCaveEntranceButton, .mapCaveEntranceComment", new CallbackCollection(this.goToTheCave.bind(this)));
    }
    
    private loadDragon(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapDragonButton",
            x+5, x+10, y,
            x+4, x+10, y+1,
            x+3, x+7, y+2,
            x+2, x+7, y+3,
            x+2, x+7, y+4,
            x+1, x+8, y+5,
            x+1, x+8, y+6,
            x+1, x+8, y+7,
            x, x+9, y+8,
            x, x+9, y+9);
        // Comments
        this.renderArea.addFullComment(x + 5, y - 2, Database.getText("mapDragonComment"), Database.getTranslatedText("mapDragonComment"), "mapDragonComment");
        // Interactions
        this.renderArea.addLinkOver(".mapDragonButton, .mapDragonComment", ".mapDragonComment");
        this.renderArea.addLinkCall(".mapDragonButton, .mapDragonComment", new CallbackCollection(this.goToDragon.bind(this)));
    }
    
    private loadFarm(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapFarmButton",
            x+5, x+15, y,
            x+5, x+15, y+1,
            x+6, x+16, y+2,
            x+6, x+16, y+3,
            x, x+16, y+3,
            x, x+16, y+4,
            x, x+16, y+5,
            x, x+16, y+6,
            x, x+16, y+7,
            x, x+16, y+8,
            x, x+16, y+9,
            x+6, x+16, y+10
        );
        // Comments
        this.renderArea.addFullComment(x + 16, y + 5, Database.getText("mapFarmComment"), Database.getTranslatedText("mapFarmComment"), "mapFarmComment");
        // Interactions
        this.renderArea.addLinkOver(".mapFarmButton, .mapFarmComment", ".mapFarmComment");
        this.renderArea.addLinkCall(".mapFarmButton, .mapFarmComment", new CallbackCollection(this.goToFarm.bind(this)));
    }
    
    private loadForest(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapForestButton",
            x+9, x+11, y,
            x+3, x+12, y+1,
            x+2, x+25, y+2,
            x+3, x+43, y+3,
            x+1, x+44, y+4,
            x+54, x+56, y+4,
            x, x+47, y+5,
            x+53, x+57, y+5,
            x+1, x+56, y+6,
            x+2, x+53, y+7,
            x+3, x+52, y+8,
            x+7, x+49, y+9,
            x+8, x+48, y+10,
            x+17, x+46, y+11,
            x+16, x+45, y+12,
            x+17, x+34, y+13,
            x+21, x+35, y+14,
            x+23, x+34, y+15,
            x+24, x+25, y+16);
        // Comments
        this.renderArea.addFullComment(x + 25, y + 7, Database.getText("mapForestComment"), Database.getTranslatedText("mapForestComment"), "mapForestComment");
        // Interactions
        this.renderArea.addLinkOver(".mapForestButton, .mapForestComment", ".mapForestComment");
        this.renderArea.addLinkCall(".mapForestButton, .mapForestComment", new CallbackCollection(this.goToForest.bind(this)));
    }
    
    private loadFortress(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapFortressButton",
            x+1, x+3, y,
            x+10, x+12, y,
            x, x+4, y+1,
            x+9, x+13, y+1,
            x, x+13, y+2,
            x, x+13, y+3,
            x, x+13, y+4);
        // Comments
        this.renderArea.addFullComment(x + 7, y + 2, Database.getText("mapFortressComment"), Database.getTranslatedText("mapFortressComment"), "mapFortressComment");
        // Interactions
        this.renderArea.addLinkOver(".mapFortressButton, .mapFortressComment", ".mapFortressComment");
        this.renderArea.addLinkCall(".mapFortressButton, .mapFortressComment", new CallbackCollection(this.goToFortress.bind(this)));
    }
    
    private loadLighthouse(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapLighthouseButton",
            x+1, x+4, y,
            x, x+5, y+1,
            x, x+5, y+2,
            x, x+5, y+3,
            x, x+5, y+4,
            x, x+5, y+5,
            x, x+5, y+6,
            x, x+5, y+7,
            x, x+5, y+8,
            x, x+5, y+9);
        // Comments
        this.renderArea.addFullComment(x + 2, y + 3, Database.getText("mapLighthouseComment"), Database.getTranslatedText("mapLighthouseComment"), "mapLighthouseComment");
        // Interactions
        this.renderArea.addLinkOver(".mapLighthouseButton, .mapLighthouseComment", ".mapLighthouseComment");
        this.renderArea.addLinkCall(".mapLighthouseButton, .mapLighthouseComment", new CallbackCollection(this.goToLighthouse.bind(this)));
    }
    
    private loadLonelyHouse(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapLonelyHouseButton",
            x, x+3, y,
            x, x+3, y+1
        );
        // Comments
        this.renderArea.addFullComment(x + 1, y - 3, Database.getText("mapLonelyHouseComment"), Database.getTranslatedText("mapLonelyHouseComment"), "mapLonelyHouseComment");
        // Interactions
        this.renderArea.addLinkOver(".mapLonelyHouseButton, .mapLonelyHouseComment", ".mapLonelyHouseComment");
        this.renderArea.addLinkCall(".mapLonelyHouseButton, .mapLonelyHouseComment", new CallbackCollection(this.goToLonelyHouse.bind(this)));
    }
    
    private loadMoutains(x: number, y: number): void{
        // The "*" show that there's a pogo stick here
        this.renderArea.drawString("*", 71, 52);
        // Button
        this.renderArea.addMultipleAsciiButtons("mapMoutainsButton",
            x, x+1, y);
        // Interactions
        this.renderArea.addLinkOver(".mapMoutainsButton, .mapMoutainsComment", ".mapMoutainsComment");
        this.renderArea.addLinkCall(".mapMoutainsButton, .mapMoutainsComment", new CallbackCollection(this.goToMoutains.bind(this)));
    }
    
    private loadPier(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapPierButton",
            x+1, x+3, y,
            x+2, x+3, y+1,
            x, x+7, y+2,
            x+4, x+7, y+3);
        // Comments
        this.renderArea.addFullComment(x + 4, y + 4, Database.getText("mapPierComment"), Database.getTranslatedText("mapPierComment"), "mapPierComment");
        // Interactions
        this.renderArea.addLinkOver(".mapPierButton, .mapPierComment", ".mapPierComment");
        this.renderArea.addLinkCall(".mapPierButton, .mapPierComment", new CallbackCollection(this.goToPier.bind(this)));
    }
    
    private loadSorceressHut(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapSorceressHutButton",
            x, x+3, y,
            x, x+3, y+1);
        // Comments
        this.renderArea.addFullComment(x + 2, y + 3, Database.getText("mapSorceressHutComment"), Database.getTranslatedText("mapSorceressHutComment"), "mapSorceressHutComment");
        // Interactions
        this.renderArea.addLinkOver(".mapSorceressHutButton, .mapSorceressHutComment", ".mapSorceressHutComment");
        this.renderArea.addLinkCall(".mapSorceressHutButton, .mapSorceressHutComment", new CallbackCollection(this.goToSorceressHut.bind(this)));
    }
    
    private loadTheDesert(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapTheDesertButton",
            x, x+29, y+2,
            x, x+29, y+3,
            x, x+29, y+4,
            x, x+29, y+5,
            x, x+29, y+6,
            x, x+29, y+7,
            x, x+28, y+8,
            x, x+27, y+9,
            x+1, x+26, y+10,
            x+2, x+25, y+11);
        // Comments
        this.renderArea.addFullComment(x + 14, y + 6, Database.getText("mapTheDesertComment"), Database.getTranslatedText("mapTheDesertComment"), "mapTheDesertComment");
        // Interactions
        this.renderArea.addLinkOver(".mapTheDesertButton, .mapTheDesertComment", ".mapTheDesertComment");
        this.renderArea.addLinkCall(".mapTheDesertButton, .mapTheDesertComment", new CallbackCollection(this.goToTheDesert.bind(this)));
    }
    
    private loadTheHole(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapTheHoleButton",
            x+1, x+4, y,
            x+1, x+3, y+1);
        // Comments
        this.renderArea.addFullComment(x + 2, y + 3, Database.getText("mapTheHoleComment"), Database.getTranslatedText("mapTheHoleComment"), "mapTheHoleComment");
        // Interactions
        this.renderArea.addLinkOver(".mapTheHoleButton, .mapTheHoleComment", ".mapTheHoleComment");
        this.renderArea.addLinkCall(".mapTheHoleButton, .mapTheHoleComment", new CallbackCollection(this.goToTheHole.bind(this)));
    }
    
    private loadTreasure(x: number, y: number): void{
        // The button
        this.renderArea.addAsciiNinjaButton(x, x+3, y, "mapTreasureButton");
        // Interactions
        this.renderArea.addLinkCall(".mapTreasureButton", new CallbackCollection(this.goToTreasure.bind(this)));
    }
    
    private loadVillage(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapVillageButton",
            x+11, x+19, y,
            x+7, x+19, y+1,
            x+4, x+21, y+2,
            x, x+21, y+3,
            x, x+18, y+4,
            x+4, x+18, y+5,
            x+8, x+11, y+6);
        // Comments
        this.renderArea.addFullComment(x + 11, y + 3, Database.getText("mapVillageComment"), Database.getTranslatedText("mapVillageComment"), "mapVillageComment");
        // Interactions
        this.renderArea.addLinkOver(".mapVillageButton, .mapVillageComment", ".mapVillageComment");
        this.renderArea.addLinkCall(".mapVillageButton, .mapVillageComment", new CallbackCollection(this.getGame().goToVillage.bind(this.getGame())));
    }
    
    private loadWishingWell(x: number, y: number): void{
        // Buttons
        this.renderArea.addMultipleAsciiButtons("mapWishingWellButton",
            x, x+3, y);
        // Comments
        this.renderArea.addFullComment(x+1, y+1, Database.getText("mapWishingWellComment"), Database.getTranslatedText("mapWishingWellComment"), "mapWishingWellComment");
        // Interactions
        this.renderArea.addLinkOver(".mapWishingWellButton, .mapWishingWellComment", ".mapWishingWellComment");
        this.renderArea.addLinkCall(".mapWishingWellButton, .mapWishingWellComment", new CallbackCollection(this.goToWishingWell.bind(this)));
    }
}