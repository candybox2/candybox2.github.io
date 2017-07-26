///<reference path="Place.ts"/>

Saving.registerBool("candyBoxBoxOpened", false);

class CandyBox extends Place{
    private renderArea: RenderArea = new RenderArea();
    
    private eatButtonShown: boolean = false;
    private throwButtonShown: boolean = false;
    private requestFeatureButtonShown: boolean = false;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the area
        this.renderArea.resize(100, 40);
        
        // Update
        this.update();
    }
    
    // willBeDisplayed()
    public willBeDisplayed(): void{
        // We check right now
        this.checkCandies();
        
        // And we add the callback
        this.getGame().getCandies().getCallbackCollection().addCallback(this.checkCandies.bind(this));
        
        // We add hotkeys
        this.getGame().addHotkey(new Hotkey("e", new CallbackCollection(this.clickedEatCandiesButton.bind(this))));
        this.getGame().addHotkey(new Hotkey("t", new CallbackCollection(this.clickedThrowCandiesButton.bind(this))));
    }
    
    // Public methods
    public update(): void{
        // Y gap for everything below the throwing candies stuff (because the throwing candies stuff can be extended a lot)
        var yGapForEverythingBelowTheThrowingCandiesStuff: number = 0;
        
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Draw the box
        if(Saving.loadBool("lonelyHouseTakeTheBoxDone")){
            if(Saving.loadBool("candyBoxBoxOpened") == true)
                this.renderArea.drawArray(Database.getAscii("general/openBox"), 68, 4);
            else
                this.renderArea.drawArray(Database.getAscii("general/box"), 68, 4);
        }
        
        // If we possess the talking candy
        if(Saving.loadBool("gridItemPossessedTalkingCandy") == true){
            // Draw the ascii art
            this.renderArea.drawArray(Database.getAscii("gridItems/talkingCandy"), 68, 37);
            
            // If we don't have the box yet
            if(Saving.loadBool("lonelyHouseTakeTheBoxDone") == false){
                // Draw the speech
                this.renderArea.drawSpeech(Database.getText("talkingCandySpeechNoBox"), 30, 72, 98, "candyBoxTalkingCandySpeech", Database.getTranslatedText("talkingCandySpeechNoBox"));
            }
            // Else, we have the box
            else{
                // If the talking candy already opened the box
                if(Saving.loadBool("candyBoxBoxOpened")){
                    // Draw the speech
                    this.renderArea.drawSpeech(Database.getText("talkingCandySpeech2"), 34, 72, 98, "candyBoxTalkingCandySpeech", Database.getTranslatedText("talkingCandySpeech2"));
                }
                // Else, the box is still closed
                else{
                    // Draw the speech
                    this.renderArea.drawSpeech(Database.getText("talkingCandySpeech1"), 30, 72, 98, "candyBoxTalkingCandySpeech", Database.getTranslatedText("talkingCandySpeech1"));
                    // Add the button
                    this.renderArea.addAsciiRealButton(Database.getText("talkingCandyButton"), 80, 37, "candyBoxTalkingCandyButton", Database.getTranslatedText("talkingCandyButton"));
                    this.renderArea.addLinkCall(".candyBoxTalkingCandyButton", new CallbackCollection(this.openBox.bind(this)));
                }
            }
        }
        
        // Eat all the candies
        if(this.eatButtonShown){
            this.renderArea.addAsciiRealButton(Database.getText("candyBoxEatCandiesButton"), 0, 1, "candyBoxEatCandiesButton", Database.getTranslatedText("candyBoxEatCandiesButton"), false, 0);
            this.renderArea.addLinkCall(".candyBoxEatCandiesButton", new CallbackCollection(this.clickedEatCandiesButton.bind(this)));
            if(this.getGame().getCandiesEaten().getCurrent() != 0) this.renderArea.drawString(this.getGame().getCandiesEaten().getCurrentAsString(), 0, 3);
        }
        
        // Throw 10 candies
        if(this.throwButtonShown){
            this.renderArea.addAsciiRealButton(Database.getText("candyBoxThrowCandiesButton"), 0, 6, "candyBoxThrowCandiesButton", Database.getTranslatedText("candyBoxThrowCandiesButton"), false, 0);
            this.renderArea.addLinkCall(".candyBoxThrowCandiesButton", new CallbackCollection(this.clickedThrowCandiesButton.bind(this)));
            if(this.getGame().getCandiesThrown().getCurrent() != 0){
                yGapForEverythingBelowTheThrowingCandiesStuff = this.getGame().getCandiesThrown().draw(this.renderArea, 0, 8); // Set the yGap..
            }
        }
        
        // Request feature
        if(this.requestFeatureButtonShown){
            if(Saving.loadBool("statusBarUnlocked") == false){
                this.renderArea.addAsciiRealButton(Database.getText("candyBoxRequestStatusBarUnlocked"), 0, 11 + yGapForEverythingBelowTheThrowingCandiesStuff, "candyBoxRequestStatusBarUnlockedButton", Database.getTranslatedText("candyBoxRequestStatusBarUnlocked"), true);
                this.renderArea.addLinkCall(".candyBoxRequestStatusBarUnlockedButton", new CallbackCollection(this.requestStatusBarUnlocked.bind(this)));
            }
            else if(Saving.loadBool("statusBarUnlockedCfg") == false){
                this.renderArea.addAsciiRealButton(Database.getText("candyBoxRequestStatusBarUnlockedCfg"), 0, 11 + yGapForEverythingBelowTheThrowingCandiesStuff, "candyBoxRequestStatusBarUnlockedCfgButton", Database.getTranslatedText("candyBoxRequestStatusBarUnlockedCfg"), true);
                this.renderArea.addLinkCall(".candyBoxRequestStatusBarUnlockedCfgButton", new CallbackCollection(this.requestStatusBarUnlockedCfg.bind(this)));
                this.renderArea.drawString(Database.getText("candyBoxRequestStatusBarUnlockedComment"), 0, 14 + yGapForEverythingBelowTheThrowingCandiesStuff);
                this.renderArea.drawString(Database.getTranslatedText("candyBoxRequestStatusBarUnlockedComment"), 0, 15 + yGapForEverythingBelowTheThrowingCandiesStuff, true);
            }
            else if(Saving.loadBool("statusBarUnlockedSave") == false){
                this.renderArea.addAsciiRealButton(Database.getText("candyBoxRequestStatusBarUnlockedSave"), 0, 11 + yGapForEverythingBelowTheThrowingCandiesStuff, "candyBoxRequestStatusBarUnlockedSaveButton", Database.getTranslatedText("candyBoxRequestStatusBarUnlockedSave"), true);
                this.renderArea.addLinkCall(".candyBoxRequestStatusBarUnlockedSaveButton", new CallbackCollection(this.requestStatusBarUnlockedSave.bind(this)));
                this.renderArea.drawString(Database.getText("candyBoxRequestStatusBarUnlockedCfgComment1"), 0, 14 + yGapForEverythingBelowTheThrowingCandiesStuff);
                this.renderArea.drawString(Database.getText("candyBoxRequestStatusBarUnlockedCfgComment2"), 0, 15 + yGapForEverythingBelowTheThrowingCandiesStuff);
                this.renderArea.drawString(Database.getTranslatedText("candyBoxRequestStatusBarUnlockedCfgComment1"), 0, 16 + yGapForEverythingBelowTheThrowingCandiesStuff, true);
                this.renderArea.drawString(Database.getTranslatedText("candyBoxRequestStatusBarUnlockedCfgComment2"), 0, 17 + yGapForEverythingBelowTheThrowingCandiesStuff, true);
            }
            else if(Saving.loadBool("statusBarUnlockedHealthBar") == false){
                this.renderArea.addAsciiRealButton(Database.getText("candyBoxRequestStatusBarUnlockedHealthBar"), 0, 11 + yGapForEverythingBelowTheThrowingCandiesStuff, "candyBoxRequestStatusBarUnlockedHealthBarButton", Database.getTranslatedText("candyBoxRequestStatusBarUnlockedHealthBar"), true);
                this.renderArea.addLinkCall(".candyBoxRequestStatusBarUnlockedHealthBarButton", new CallbackCollection(this.requestStatusBarUnlockedHealthBar.bind(this)));
                this.renderArea.drawString(Database.getText("candyBoxRequestStatusBarUnlockedSaveComment"), 0, 14 + yGapForEverythingBelowTheThrowingCandiesStuff);
                this.renderArea.drawString(Database.getTranslatedText("candyBoxRequestStatusBarUnlockedSaveComment"), 0, 15 + yGapForEverythingBelowTheThrowingCandiesStuff, true);
            }
            else if(Saving.loadBool("statusBarUnlockedMap") == false){
                this.renderArea.addAsciiRealButton(Database.getText("candyBoxRequestStatusBarUnlockedMap"), 0, 11 + yGapForEverythingBelowTheThrowingCandiesStuff, "candyBoxRequestStatusBarUnlockedMapButton", Database.getTranslatedText("candyBoxRequestStatusBarUnlockedMap"), true);
                this.renderArea.addLinkCall(".candyBoxRequestStatusBarUnlockedMapButton", new CallbackCollection(this.requestStatusBarUnlockedMap.bind(this)));
                this.renderArea.drawString(Database.getText("candyBoxRequestStatusBarUnlockedHealthBarComment"), 0, 14 + yGapForEverythingBelowTheThrowingCandiesStuff);
                this.renderArea.drawString(Database.getTranslatedText("candyBoxRequestStatusBarUnlockedHealthBarComment"), 0, 15 + yGapForEverythingBelowTheThrowingCandiesStuff, true);
            }
        }
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private checkCandies(): void{
        // Possibly show the eat button
        if(this.eatButtonShown == false){
            if(this.getGame().getCandies().getMax() > 0){
                this.eatButtonShown = true;
                this.update();
                this.getGame().updatePlace();
            }
        }
        
        // Possibly show the throw button
        if(this.throwButtonShown == false){
            if(this.getGame().getCandies().getMax() >= 10){
                this.throwButtonShown = true;
                this.update();
                this.getGame().updatePlace();
            }
        }
        
        // Possibly show the request feature button
        if(this.requestFeatureButtonShown == false){
            // If we have enough candies & the last feature isn't unlocked yet
            if(this.getGame().getCandies().getMax() >= 30 && Saving.loadBool("statusBarUnlockedMap") == false){
                this.requestFeatureButtonShown = true;
                this.update();
                this.getGame().updatePlace();
            }
        }
    }
    
    private clickedEatCandiesButton(): void{
        if(this.getGame().getCandies().getCurrent() >= 1){
            this.getGame().getCandies().transferTo(this.getGame().getCandiesEaten());
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private clickedThrowCandiesButton(): void{
        if(this.getGame().getCandies().getCurrent() >= 10){
            this.getGame().getCandies().transferTo(this.getGame().getCandiesThrown(), 10);
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private openBox(): void{
        // The box is now opened
        Saving.saveBool("candyBoxBoxOpened", true);
        
        // The tabs are unlocked
        Saving.saveBool("statusBarUnlockedInsideYourBox", true);
        Saving.saveBool("statusBarUnlockedTheComputer", true);
        Saving.saveBool("statusBarUnlockedTheArena", true);
        this.getGame().updateStatusBar(true);
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private requestStatusBarUnlocked(): void{
        if(this.getGame().getCandies().getCurrent() >= 30){
            this.getGame().getCandies().transferTo(this.getGame().getCandiesUsedToRequestFeatures(), 30);
            Saving.saveBool("statusBarUnlocked", true);
            this.getGame().updateStatusBar(true);
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private requestStatusBarUnlockedCfg(): void{
        if(this.getGame().getCandies().getCurrent() >= 5){
            this.getGame().getCandies().transferTo(this.getGame().getCandiesUsedToRequestFeatures(), 5);
            Saving.saveBool("statusBarUnlockedCfg", true);
            this.getGame().updateStatusBar(true);
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private requestStatusBarUnlockedHealthBar(): void{
        if(this.getGame().getCandies().getCurrent() >= 5){
            this.getGame().getCandies().transferTo(this.getGame().getCandiesUsedToRequestFeatures(), 5);
            Saving.saveBool("statusBarUnlockedHealthBar", true);
            this.getGame().updateStatusBar(true);
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private requestStatusBarUnlockedMap(): void{
        if(this.getGame().getCandies().getCurrent() >= 10){
            this.getGame().getCandies().transferTo(this.getGame().getCandiesUsedToRequestFeatures(), 10);
            Saving.saveBool("statusBarUnlockedMap", true);
            this.getGame().updateStatusBar(true);
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private requestStatusBarUnlockedSave(): void{
        if(this.getGame().getCandies().getCurrent() >= 5){
            this.getGame().getCandies().transferTo(this.getGame().getCandiesUsedToRequestFeatures(), 5);
            Saving.saveBool("statusBarUnlockedSave", true);
            this.getGame().updateStatusBar(true);
            this.update();
            this.getGame().updatePlace();
        }
    }
}
