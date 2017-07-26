///<reference path="Place.ts"/>

Saving.registerBool("lonelyHouseOpenBoxDone", false);
Saving.registerBool("lonelyHouseShakeBoxDone", false);
Saving.registerBool("lonelyHouseBreakLockDone", false);
Saving.registerBool("lonelyHouseKickBoxDone", false);
Saving.registerBool("lonelyHouseAskTheBoxToOpenItselfDone", false);
Saving.registerBool("lonelyHouseLureTheBoxWithACandyDone", false);
Saving.registerBool("lonelyHouseTakeTheBoxDone", false);

class LonelyHouse extends Place{
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

    // Private methods
    private askTheBoxToOpenItself(): void{
        Saving.saveBool("lonelyHouseAskTheBoxToOpenItselfDone", true);
        this.update();
        this.getGame().updatePlace();
    }
    
    private breakLock(): void{
        Saving.saveBool("lonelyHouseBreakLockDone", true);
        this.update();
        this.getGame().updatePlace();
    }
    
    private kickBox(): void{
        Saving.saveBool("lonelyHouseKickBoxDone", true);
        this.update();
        this.getGame().updatePlace();
    }
    
    private lureTheBoxWithACandy(): void{
        Saving.saveBool("lonelyHouseLureTheBoxWithACandyDone", true);
        this.update();
        this.getGame().updatePlace();
    }
    
    private openBox(): void{
        Saving.saveBool("lonelyHouseOpenBoxDone", true);
        this.update();
        this.getGame().updatePlace();
    }
    
    private shakeBox(): void{
        Saving.saveBool("lonelyHouseShakeBoxDone", true);
        this.update();
        this.getGame().updatePlace();
    }
    
    private takeTheBox(): void{
        // Change the bool
        Saving.saveBool("lonelyHouseTakeTheBoxDone", true);
        
        // We update
        this.update();
        
        // Select the candy box tab
        this.getGame().getStatusBar().selectTabByType(StatusBarTabType.CANDY_BOX);
        
        // Go to the candy box
        this.getGame().goToCandyBox();
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "lonelyHouseBackToTheMapButton");
        
        // Draw the house
        this.renderArea.drawArray(Database.getAscii("places/lonelyHouse"), 0, 3);
        
        // Draw the box
        if(Saving.loadBool("lonelyHouseTakeTheBoxDone") == false){
            this.renderArea.drawArray(Database.getAscii("general/box"), 54, 9);
        }
        
        // Add the buttons or texts
        if(Saving.loadBool("lonelyHouseOpenBoxDone") == false){
            this.getRenderArea().addAsciiRealButton(Database.getText("lonelyHouseOpenBox"), 4, 4, "lonelyHouseOpenBoxButton", Database.getTranslatedText("lonelyHouseOpenBox"), true, -1, null, false);
            this.getRenderArea().addLinkCall(".lonelyHouseOpenBoxButton", new CallbackCollection(this.openBox.bind(this)));
        }
        else{
            this.getRenderArea().drawString(Database.getText("lonelyHouseOpenBoxResult"), 4, 4);
            this.getRenderArea().drawString(Database.getTranslatedText("lonelyHouseOpenBoxResult"), 4, 5, true);
        }
        
        if(Saving.loadBool("lonelyHouseShakeBoxDone") == false){
            this.getRenderArea().addAsciiRealButton(Database.getText("lonelyHouseShakeBox"), 4, 8, "lonelyHouseShakeBoxButton", Database.getTranslatedText("lonelyHouseShakeBox"), true, -1, null, false);
            this.getRenderArea().addLinkCall(".lonelyHouseShakeBoxButton", new CallbackCollection(this.shakeBox.bind(this)));
        }
        else{
            this.getRenderArea().drawString(Database.getText("lonelyHouseShakeBoxResult"), 4, 8);
            this.getRenderArea().drawString(Database.getTranslatedText("lonelyHouseShakeBoxResult"), 4, 9, true);
        }
        
        if(Saving.loadBool("lonelyHouseBreakLockDone") == false){
            this.getRenderArea().addAsciiRealButton(Database.getText("lonelyHouseBreakLock"), 4, 12, "lonelyHouseBreakLockButton", Database.getTranslatedText("lonelyHouseBreakLock"), true, -1, null, false);
            this.getRenderArea().addLinkCall(".lonelyHouseBreakLockButton", new CallbackCollection(this.breakLock.bind(this)));
        }
        else{
            this.getRenderArea().drawString(Database.getText("lonelyHouseBreakLockResult"), 4, 12);
            this.getRenderArea().drawString(Database.getTranslatedText("lonelyHouseBreakLockResult"), 4, 13, true);
        }
        
        if(Saving.loadBool("lonelyHouseKickBoxDone") == false){
            this.getRenderArea().addAsciiRealButton(Database.getText("lonelyHouseKickBox"), 4, 16, "lonelyHouseKickBoxButton", Database.getTranslatedText("lonelyHouseKickBox"), true, -1, null, false);
            this.getRenderArea().addLinkCall(".lonelyHouseKickBoxButton", new CallbackCollection(this.kickBox.bind(this)));
        }
        else{
            this.getRenderArea().drawString(Database.getText("lonelyHouseKickBoxResult"), 4, 16);
            this.getRenderArea().drawString(Database.getTranslatedText("lonelyHouseKickBoxResult"), 4, 17, true);
        }
        
        if(Saving.loadBool("lonelyHouseAskTheBoxToOpenItselfDone") == false){
            this.getRenderArea().addAsciiRealButton(Database.getText("lonelyHouseAskTheBoxToOpenItself"), 4, 20, "lonelyHouseAskTheBoxToOpenItselfButton", Database.getTranslatedText("lonelyHouseAskTheBoxToOpenItself"), true, -1, null, false);
            this.getRenderArea().addLinkCall(".lonelyHouseAskTheBoxToOpenItselfButton", new CallbackCollection(this.askTheBoxToOpenItself.bind(this)));
        }
        else{
            this.getRenderArea().drawString(Database.getText("lonelyHouseAskTheBoxToOpenItselfResult"), 4, 20);
            this.getRenderArea().drawString(Database.getTranslatedText("lonelyHouseAskTheBoxToOpenItselfResult"), 4, 21, true);
        }
        
        if(Saving.loadBool("lonelyHouseLureTheBoxWithACandyDone") == false){
            this.getRenderArea().addAsciiRealButton(Database.getText("lonelyHouseLureTheBoxWithACandy"), 4, 24, "lonelyHouseLureTheBoxWithACandyButton", Database.getTranslatedText("lonelyHouseLureTheBoxWithACandy"), true, -1, null, false);
            this.getRenderArea().addLinkCall(".lonelyHouseLureTheBoxWithACandyButton", new CallbackCollection(this.lureTheBoxWithACandy.bind(this)));
        }
        else{
            this.getRenderArea().drawString(Database.getText("lonelyHouseLureTheBoxWithACandyResult"), 4, 24);
            this.getRenderArea().drawString(Database.getTranslatedText("lonelyHouseLureTheBoxWithACandyResult"), 4, 25, true);
        }
        
        // Final button
        if(Saving.loadBool("lonelyHouseOpenBoxDone") &&
           Saving.loadBool("lonelyHouseShakeBoxDone") &&
           Saving.loadBool("lonelyHouseBreakLockDone") &&
           Saving.loadBool("lonelyHouseKickBoxDone") &&
           Saving.loadBool("lonelyHouseAskTheBoxToOpenItselfDone") &&
           Saving.loadBool("lonelyHouseLureTheBoxWithACandyDone")
         ){
            if(Saving.loadBool("lonelyHouseTakeTheBoxDone") == false){
                this.getRenderArea().addAsciiRealButton(Database.getText("lonelyHouseTakeTheBox"), 6, 35, "lonelyHouseTakeTheBoxButton", Database.getTranslatedText("lonelyHouseTakeTheBox"), true, -1, null, false);
                this.getRenderArea().addLinkCall(".lonelyHouseTakeTheBoxButton", new CallbackCollection(this.takeTheBox.bind(this)));
            }
            else{
                this.getRenderArea().drawString(Database.getText("lonelyHouseTakeTheBoxResult"), 6, 35);
                this.getRenderArea().drawString(Database.getTranslatedText("lonelyHouseTakeTheBoxResult"), 6, 36, true);
            }
        }
    }
}