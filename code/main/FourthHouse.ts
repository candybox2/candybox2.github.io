///<reference path="House.ts"/>

Saving.registerBool("fourthHouseFoundLollipopOnCupboard", false);
Saving.registerNumber("fourthHouseCupboardStep", 0); // 0 : closed ; 1 : opened ; 2 : lollipop taken
Saving.registerNumber("fourthHouseCarpetStep", 0); // 0 : lollipop still under the carpet ; 1 : lollipop outside ; 2 : lollipop taken

class FourthHouse extends House{
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resizeFromArray(Database.getAscii("places/village/fourthHouse"), 0, 3);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private clickOnCarpet(): void{
        // If we never clicked on the carpet
        if(Saving.loadNumber("fourthHouseCarpetStep") == 0){
            // Set the step
            Saving.saveNumber("fourthHouseCarpetStep", 1);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private drawCarpetStuff(x: number, y: number): void{
        // We do different things depending on the step
        switch(Saving.loadNumber("fourthHouseCarpetStep")){
            case 0: // The lollipop is still under the carpet
                // We add a button on the area of the carpet around the lollipop
                this.renderArea.addMultipleAsciiButtons("fourthHouseCarpetButton",
                                                        x-2, x+2, y-1,
                                                        x-6, x+1, y,
                                                        x-4, x, y+1);
                // We add the link
                this.renderArea.addLinkCall(".fourthHouseCarpetButton", new CallbackCollection(this.clickOnCarpet.bind(this)));
            break;
            case 1: // The lollipop is outside the carpet, ready to be clicked
                // We draw the lollipop
                this.renderArea.drawArray(Database.getAscii("places/village/fourthHouseLollipopUnderCarpet"), x, y);
                // We add a button on the lollipop
                this.renderArea.addAsciiButton(x, x+4, y, "fourthHouseLollipopUnderCarpetButton");
                // We add the link
                this.renderArea.addLinkCall(".fourthHouseLollipopUnderCarpetButton", new CallbackCollection(this.pickCarpetLollipop.bind(this)));
            break;
            case 2: // The lollipop is taken, nothing to do here
            break;
        }
    }
    
    private drawLollipopOnCupboardStuff(x: number, y: number): void{
        // If we didn't find the lollipop yet
        if(Saving.loadBool("fourthHouseFoundLollipopOnCupboard") == false){
            // We add a button to take the lollipop on the cupboard
            this.renderArea.addAsciiButton(x+8, x+13, y+1, "fourthHouseLollipopOnCupboardButton");
            // We add the link
            this.renderArea.addLinkCall(".fourthHouseLollipopOnCupboardButton", new CallbackCollection(this.takeLollipopOnCupboard.bind(this)));
        }
        // Else, we found the lollipop
        else{
            // We draw the no lollipop ascii art
            this.renderArea.drawArray(Database.getAscii("places/village/fourthHouseNoLollipopOnCupboard"), x, y);
        }
    }
    
    private drawOpenCupboardStuff(x: number, y: number): void{
        // We do different things depending on the step
        switch(Saving.loadNumber("fourthHouseCupboardStep")){
            case 0: // The cupboard is closed
                // We add a button on the cupboard's door
                this.renderArea.addMultipleAsciiButtons("fourthHouseCupboardDoorButton",
                                                        x, x+7, y,
                                                        x, x+7, y+1,
                                                        x, x+7, y+2,
                                                        x, x+7, y+3,
                                                        x, x+7, y+4,
                                                        x, x+7, y+5,
                                                        x, x+7, y+6,
                                                        x, x+7, y+7,
                                                        x, x+7, y+8,
                                                        x, x+7, y+9,
                                                        x, x+7, y+10,
                                                        x, x+7, y+11,
                                                        x, x+7, y+12);
                // We add the link
                this.renderArea.addLinkCall(".fourthHouseCupboardDoorButton", new CallbackCollection(this.openCupboard.bind(this)));
            break;
            case 1: // The cupboard is opened with the lollipop in it
                // We draw the opened cupboard with the lollipop in it
                this.renderArea.drawArray(Database.getAscii("places/village/fourthHouseCupboardOpenedWithLollipop"), x-2, y);
                // We add a button on the lollipop
                this.renderArea.addAsciiButton(x+4, x+6, y+7, "fourthHouseLollipopInsideCupboardButton");
                // We add the link
                this.renderArea.addLinkCall(".fourthHouseLollipopInsideCupboardButton", new CallbackCollection(this.takeLollipopInsideCupboard.bind(this)));
            break;
            case 2: // The cupboard is opened and the lollipop taken
                // We draw the opened cupboard without lollipop
                this.renderArea.drawArray(Database.getAscii("places/village/fourthHouseCupboardOpenedWithoutLollipop"), x-2, y);
            break;
        }
    }
    
    private openCupboard(): void{
        // If the cupboard isn't opened yet
        if(Saving.loadNumber("fourthHouseCupboardStep") == 0){
            // Set the step
            Saving.saveNumber("fourthHouseCupboardStep", 1);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private pickCarpetLollipop(): void{
        // If the lollipop is outside the carpet
        if(Saving.loadNumber("fourthHouseCarpetStep") == 1){
            // Set the step
            Saving.saveNumber("fourthHouseCarpetStep", 2);
            // Add one lollipop
            this.getGame().getLollipops().add(1);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private takeLollipopInsideCupboard(): void{
        // If the cupboard is opened with the lollipop inside it
        if(Saving.loadNumber("fourthHouseCupboardStep") == 1){
            // Set the step
            Saving.saveNumber("fourthHouseCupboardStep", 2);
            // Add one lollipop
            this.getGame().getLollipops().add(1);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private takeLollipopOnCupboard(): void{
        // If we didn't get the lollipop yet
        if(Saving.loadBool("fourthHouseFoundLollipopOnCupboard") == false){
            // Add one lollipop
            this.getGame().getLollipops().add(1);
            // Set the bool
            Saving.saveBool("fourthHouseFoundLollipopOnCupboard", true);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToTheVillageButton(this.renderArea, "fourthHouseBackToTheVillageButton");
        
        // Draw the house
        this.renderArea.drawArray(Database.getAscii("places/village/fourthHouse"), 0, 3);
        
        // Draw stuff about the lollipop on the cupboard
        this.drawLollipopOnCupboardStuff(35, 11);
        
        // Draw stuff about opening the cupboard
        this.drawOpenCupboardStuff(35, 14);
        
        // Draw stuff about the lollipop under the carpet
        this.drawCarpetStuff(41, 32);
    }
}