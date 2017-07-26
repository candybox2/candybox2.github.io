///<reference path="Place.ts"/>

// Buttons unlocked
Saving.registerBool("lollipopFarmPlant1LollipopButtonUnlocked", false);
Saving.registerBool("lollipopFarmPlant10LollipopsButtonUnlocked", false);
Saving.registerBool("lollipopFarmPlant100LollipopsButtonUnlocked", false);
Saving.registerBool("lollipopFarmPlant1000LollipopsButtonUnlocked", false);

// How many lollipops planted ?
Saving.registerNumber("lollipopFarmLollipopsPlanted", 0);

// The production
Saving.registerNumber("lollipopFarmTimeSinceLastProduction", 0);
Saving.registerBool("lollipopFarmIsProductionEachSecond", false);
Saving.registerNumber("lollipopFarmProduction", 0);

// The mill
Saving.registerBool("lollipopFarmConstructMillButtonUnlocked", false);
Saving.registerBool("lollipopFarmMillConstructed", false);

// The pond
Saving.registerBool("lollipopFarmDigPondButtonUnlocked", false);
Saving.registerBool("lollipopFarmPondDug", false);
Saving.registerNumber("lollipopFarmPondHowManyLolligators", 0);
Saving.registerBool("lollipopFarmPondFeedingLolligators", false);
Saving.registerNumber("lollipopFarmPondConversionRate", 0);

// The candies production
Saving.registerNumber("lollipopFarmPreviousCandiesProduction", 1);
Saving.registerNumber("lollipopFarmCurrentCandiesProduction", 1);

class LollipopFarm extends Place{
    // Render area
    private renderArea: RenderArea = new RenderArea();
    
    // Pond lines
    private pondLines: PondLine[] = [];
    
    // Pond lolligators
    private pondLolligators: PondLolligator[] = [];
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the area
        this.renderArea.resizeFromArray(Database.getAscii("places/lollipopFarm/lollipopFarm"), 0, 12);
        
        // Update
        this.update();
        
        // Add pond lines to the pond lines array
        this.addPondLine(new PondLine(8, 37)); // first line, index 0 but at y position 3 on the pond
        this.addPondLine(new PondLine(9, 38)); // second line, index 1, y position 4
        this.addPondLine(new PondLine(9, 40)); // etc
        this.addPondLine(new PondLine(8, 43));
        this.addPondLine(new PondLine(8, 46));
        this.addPondLine(new PondLine(3, 47));
        this.addPondLine(new PondLine(4, 48));
        this.addPondLine(new PondLine(9, 45));
        this.addPondLine(new PondLine(12, 44));
    }
    
    // Public methods
    public willBeDisplayed(): void{
        // We check lollipops
        this.checkLollipops();
        
        // We add the lollipops callback
        this.getGame().getLollipops().getCallbackCollection().addCallback(this.checkLollipops.bind(this));
        
        // We add the one second callback for the pond
        this.getGame().getOneSecondCallbackCollection().addCallback(this.handlePond.bind(this));
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private addPondLine(pondLine: PondLine): void{
        this.pondLines.push(pondLine);
    }
    
    private addPondLolligator(pondLolligator: PondLolligator): void{
        this.pondLolligators.push(pondLolligator);
    }
    
    private beginFeedingLolligators(): void{
        // We set the bool
        Saving.saveBool("lollipopFarmPondFeedingLolligators", true);
        
        // We update
        this.update();
        this.getGame().updatePlace();
    }
    
    private buyLolligator(): void{
        if(this.getGame().getCandies().getCurrent() >= 1200){
            this.getGame().getCandies().add(-1200);
            // Update the number of lolligators
            Saving.saveNumber("lollipopFarmPondHowManyLolligators", Saving.loadNumber("lollipopFarmPondHowManyLolligators") + 1);
            // Update the conversion rate
            this.updatePondConversionRate();
            // Update the place
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private checkLollipops(): void{
        // We possibly unlock some buttons used for planting lollipops
        if(Saving.loadBool("lollipopFarmPlant1LollipopButtonUnlocked") == false && this.getGame().getLollipops().getMax() >= 1){
            Saving.saveBool("lollipopFarmPlant1LollipopButtonUnlocked", true);
            this.update();
            this.getGame().updatePlace();
        }
        if(Saving.loadBool("lollipopFarmPlant10LollipopsButtonUnlocked") == false && this.getGame().getLollipops().getMax() >= 10){
            Saving.saveBool("lollipopFarmPlant10LollipopsButtonUnlocked", true);
            this.update();
            this.getGame().updatePlace();
        }
        if(Saving.loadBool("lollipopFarmPlant100LollipopsButtonUnlocked") == false && this.getGame().getLollipops().getMax() >= 100){
            Saving.saveBool("lollipopFarmPlant100LollipopsButtonUnlocked", true);
            this.update();
            this.getGame().updatePlace();
        }
        if(Saving.loadBool("lollipopFarmPlant1000LollipopsButtonUnlocked") == false && this.getGame().getLollipops().getMax() >= 1000){
            Saving.saveBool("lollipopFarmPlant1000LollipopsButtonUnlocked", true);
            this.update();
            this.getGame().updatePlace();
        }
        
        // We possibly unlock the button used to construct the mill
        if(Saving.loadBool("lollipopFarmConstructMillButtonUnlocked") == false && this.getGame().getLollipops().getMax() >= 10000){
            Saving.saveBool("lollipopFarmConstructMillButtonUnlocked", true);
            this.update();
            this.getGame().updatePlace();
        }
        
        // We possibly unlock the button used to dig the pond
        if(Saving.loadBool("lollipopFarmDigPondButtonUnlocked") == false && this.getGame().getLollipops().getMax() >= 100000){
            Saving.saveBool("lollipopFarmDigPondButtonUnlocked", true);
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private constructMill(): void{
        if(this.getGame().getLollipops().getCurrent() >= 10000){
            this.getGame().getLollipops().add(-10000);
            Saving.saveBool("lollipopFarmMillConstructed", true);
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private digPond(): void{
        if(this.getGame().getLollipops().getCurrent() >= 100000){
            this.getGame().getLollipops().add(-100000);
            Saving.saveBool("lollipopFarmPondDug", true);
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private drawFieldStuff(x: number, y: number): void{
        // A variable useful later
        var plantingButtonsXPos: number;
        
        // How many lollipops planted
        this.renderArea.drawString("Lollipops planted : " + Algo.numberToStringButNicely(Saving.loadNumber("lollipopFarmLollipopsPlanted")), x, y);
        
        // Button(s) to plant lollipops
            // If the first button is unlocked but not the second
            if(Saving.loadBool("lollipopFarmPlant1LollipopButtonUnlocked") == true && Saving.loadBool("lollipopFarmPlant10LollipopsButtonUnlocked") == false){
                this.renderArea.addAsciiRealButton("Plant 1 lollipop", x, y+2, "lollipopFarmPlant1LollipopButton");
                this.renderArea.addLinkCall(".lollipopFarmPlant1LollipopButton", new CallbackCollection(this.plantLollipops.bind(this, 1)));
            }
            // Else, if the second is unlocked
            else if(Saving.loadBool("lollipopFarmPlant10LollipopsButtonUnlocked") == true){
                // We set the x position to 0
                plantingButtonsXPos = 0;
                // We draw the first text
                this.renderArea.drawString("Plant", x, y+2);
                plantingButtonsXPos += 6;
                // We add the button to plant 1
                this.renderArea.addAsciiRealButton("1", x + plantingButtonsXPos, y+2, "lollipopFarmPlant1LollipopButton");
                this.renderArea.addLinkCall(".lollipopFarmPlant1LollipopButton", new CallbackCollection(this.plantLollipops.bind(this, 1)));
                plantingButtonsXPos += 2;
                // We add the button to plant 10
                this.renderArea.addAsciiRealButton("10", x + plantingButtonsXPos, y+2, "lollipopFarmPlant10LollipopsButton");
                this.renderArea.addLinkCall(".lollipopFarmPlant10LollipopsButton", new CallbackCollection(this.plantLollipops.bind(this, 10)));
                plantingButtonsXPos += 3;
                // We possibly add the button to plant 100
                if(Saving.loadBool("lollipopFarmPlant100LollipopsButtonUnlocked") == true){
                    this.renderArea.addAsciiRealButton("100", x + plantingButtonsXPos, y+2, "lollipopFarmPlant100LollipopsButton");
                    this.renderArea.addLinkCall(".lollipopFarmPlant100LollipopsButton", new CallbackCollection(this.plantLollipops.bind(this, 100)));
                    plantingButtonsXPos += 4;
                }
                // We possibly add the button to plant 100
                if(Saving.loadBool("lollipopFarmPlant1000LollipopsButtonUnlocked") == true){
                    this.renderArea.addAsciiRealButton("1000", x + plantingButtonsXPos, y+2, "lollipopFarmPlant1000LollipopsButton");
                    this.renderArea.addLinkCall(".lollipopFarmPlant1000LollipopsButton", new CallbackCollection(this.plantLollipops.bind(this, 1000)));
                    plantingButtonsXPos += 5;
                }
                // We add the final text
                this.renderArea.drawString("lollipops", x + plantingButtonsXPos, y+2);
            }

        // The production
        if(Saving.loadNumber("lollipopFarmLollipopsPlanted") > 0){
            this.renderArea.drawString("Production : " + this.getProductionAsString(), x, y+4);
        }
    }
    
    private drawMillStuff(x: number, y: number): void{
        // Button to construct the mill (show if the button is unlocked and the mill isn't constructed yet)
        if(Saving.loadBool("lollipopFarmConstructMillButtonUnlocked") == true && Saving.loadBool("lollipopFarmMillConstructed") == false){
            this.renderArea.addAsciiRealButton(Database.getText("lollipopFarmConstructMill"), x+30, y+2, "lollipopFarmConstructMillButton", Database.getTranslatedText("lollipopFarmConstructMill"), true, -1, null, false);
            this.renderArea.addLinkCall(".lollipopFarmConstructMillButton", new CallbackCollection(this.constructMill.bind(this)));
        }
        
        // If the mill is constructed
        if(Saving.loadBool("lollipopFarmMillConstructed") == true){
            // Draw the mill ascii art
            this.renderArea.drawArray(Database.getAscii("places/lollipopFarm/mill"), x, y);
            
            // Draw the button to feed the mill
            this.renderArea.addAsciiRealButton(Database.getText("lollipopFarmFeedMill") + " (" + Algo.numberToStringButNicely(this.getNumberOfLollipopsToFeedTheMill()) + " lollipops)", x+30, y, "lollipopFarmFeedMillButton", Database.getTranslatedText("lollipopFarmFeedMill"), true, -1, null, false);
            this.renderArea.addLinkCall(".lollipopFarmFeedMillButton", new CallbackCollection(this.feedMill.bind(this)));
        
            // Draw the current candies production if it's different from one
            if(Saving.loadNumber("lollipopFarmCurrentCandiesProduction") != 1){
                this.renderArea.drawString(Database.getText("lollipopFarmCurrentCandiesProduction") + " : " + Saving.loadNumber("lollipopFarmCurrentCandiesProduction").toString() + " each second", x+30, y+3);
                this.renderArea.drawString(Database.getTranslatedText("lollipopFarmCurrentCandiesProduction"), x+30, y+4, true);
            }
        }
    }
    
    private drawPondStuff(x: number, y: number): void{
        // Y position used because some things need to be moved when the player uses a non-english language
        var yPos: number;
        
        // Button to dig the pond (show if the button is unlocked and the pond isn't constructed yet)
        if(Saving.loadBool("lollipopFarmDigPondButtonUnlocked") == true && Saving.loadBool("lollipopFarmPondDug") == false){
            this.renderArea.addAsciiRealButton(Database.getText("lollipopFarmDigPond"), x+10, y+2, "lollipopFarmDigPondButton", Database.getTranslatedText("lollipopFarmDigPond"), true, -1, null, false);
            this.renderArea.addLinkCall(".lollipopFarmDigPondButton", new CallbackCollection(this.digPond.bind(this)));
        }
        
        // If the pond is constructed
        if(Saving.loadBool("lollipopFarmPondDug") == true){
            // Init the y position
            yPos = y;
            
            // Draw the pond ascii art
            this.renderArea.drawArray(Database.getAscii("places/lollipopFarm/pond"), x, yPos, new RenderTransparency(" "));
            
            // Draw the lolligators
            yPos += 3;
            for(var i = 0; i < this.pondLolligators.length; i++){
                this.pondLolligators[i].draw(this.renderArea, x, yPos);
            }
            
            // Add the button to buy a lolligator
            yPos += 13;
            this.renderArea.addAsciiRealButton(Database.getText("lollipopFarmBuyLolligator"), x, yPos, "lollipopFarmBuyLolligatorButton", Database.getTranslatedText("lollipopFarmBuyLolligator"), true, -1, null, false);
            this.renderArea.addLinkCall(".lollipopFarmBuyLolligatorButton", new CallbackCollection(this.buyLolligator.bind(this)));
            
            // Add 1 to yPos if translated
            if(Database.isTranslated()) yPos += 1;
            
            // If we have at least one lolligator
            if(Saving.loadNumber("lollipopFarmPondHowManyLolligators") > 0){
                // Draw how many lolligators we have (if we have at least one)
                yPos += 2;
                this.renderArea.drawString("There " + (Saving.loadNumber("lollipopFarmPondHowManyLolligators") > 1? "are":"is") + " " + Algo.pluralFormat(Saving.loadNumber("lollipopFarmPondHowManyLolligators"), " lolligator", " lolligators") + " in the pond.", x, yPos);
        
                // Draw the checkbox to feed the lolligators
                yPos += 2;
                this.renderArea.addCheckbox(x, yPos, new CallbackCollection(this.beginFeedingLolligators.bind(this)), new CallbackCollection(this.stopFeedingLolligators.bind(this)), "lollipopFarmPondCheckbox", Saving.loadBool("lollipopFarmPondFeedingLolligators"));
                if(Saving.loadNumber("lollipopFarmPondHowManyLolligators") == 1) this.renderArea.drawString("Feed it with candies", x+3, yPos);
                else this.renderArea.drawString("Feed them with candies", x+4, yPos);
                
                // If we're feeding lolligators
                if(Saving.loadBool("lollipopFarmPondFeedingLolligators")){
                    // Draw the conversion text
                    yPos += 2;
                    this.renderArea.drawString(Database.getText("lollipopFarmLolligatorsConversionText"), x, yPos);
                    if(Database.isTranslated()){
                        yPos += 1;
                        this.renderArea.drawString(Database.getTranslatedText("lollipopFarmLolligatorsConversionText"), x, yPos, true);
                    }
                    
                    // Draw the conversion rate
                    yPos += 1;
                    this.renderArea.drawString("Conversion rate : " + Saving.loadNumber("lollipopFarmPondConversionRate") + "/sec", x, yPos);
                }
            }
        }
    }
    
    private feedMill(): void{
        if(this.getGame().getLollipops().getCurrent() >= this.getNumberOfLollipopsToFeedTheMill()){
            // Pay the lollipops
            this.getGame().getLollipops().add(-this.getNumberOfLollipopsToFeedTheMill());
            
            // Increase the candies production step
            var oldCurrent: number = Saving.loadNumber("lollipopFarmCurrentCandiesProduction");
            Saving.saveNumber("lollipopFarmCurrentCandiesProduction", Saving.loadNumber("lollipopFarmCurrentCandiesProduction") + Saving.loadNumber("lollipopFarmPreviousCandiesProduction"));
            Saving.saveNumber("lollipopFarmPreviousCandiesProduction", oldCurrent);
            
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private getNumberOfLollipopsToFeedTheMill(): number{
        return Math.pow(Saving.loadNumber("lollipopFarmCurrentCandiesProduction") * 120, 2);
    }
    
    private getProductionAsString(): string{
        // We create the string
        var str: string;
        
        // If we produce x lollipops each second
        if(Saving.loadBool("lollipopFarmIsProductionEachSecond")){
            str = Algo.pluralFormat(Saving.loadNumber("lollipopFarmProduction"), " lollipop", " lollipops") + " each second";
        }
        else{
            str = "1 lollipop every ";
            // If the production is every hour
            if(Saving.loadNumber("lollipopFarmProduction") >= 3600){
                if(Math.floor(Saving.loadNumber("lollipopFarmProduction")/3600) == 1)
                    str += "hour";
                else
                    str += Math.floor(Saving.loadNumber("lollipopFarmProduction")/3600).toString() + " hours";
            }
            // Else, if the production is every minute
            else if(Saving.loadNumber("lollipopFarmProduction") >= 60){
                if(Math.floor(Saving.loadNumber("lollipopFarmProduction")/60) == 1)
                    str += "minute";
                else
                    str += Math.floor(Saving.loadNumber("lollipopFarmProduction")/60).toString() + " minutes";
            }
            // Else, the production is every second
            else{
                if(Saving.loadNumber("lollipopFarmProduction") == 1)
                    str += "second";
                else
                    str += Saving.loadNumber("lollipopFarmProduction").toString() + " seconds";
            }
        }
        
        // We return the string
        return str;
    }
    
    private handlePond(): void{
        // Used later
        var lineIndex: number;
        
        // If the pond is dug
        if(Saving.loadBool("lollipopFarmPondDug") == true){
            // Move all the lolligators
            for(var i = 0; i < this.pondLolligators.length; i++){
                this.pondLolligators[i].move();
            }
            
            // Delete lolligators which need to be deleted
            for(var i = 0; i < this.pondLolligators.length; i++){
                // If this lolligator should be deleted, then we delete it
                if(this.pondLolligators[i].shouldBeDeleted()){
                    // Warn that it will be deleted
                    this.pondLolligators[i].willBeDeleted();
                    
                    // Delete it
                    this.pondLolligators.splice(i, 1);
                    
                    // Reduce i
                    i--;
                }
            }
            
            // Possibly add a lolligator if there wouldn't be more lolligators than we actually have (the more lollipops we have the more chance there is that one will be added)
            if(Random.oneChanceOutOf(Math.ceil(20*(1/Saving.loadNumber("lollipopFarmPondHowManyLolligators")))) && this.pondLolligators.length < Saving.loadNumber("lollipopFarmPondHowManyLolligators")){
                // Choose a line
                lineIndex = Random.between(0, this.pondLines.length-1);
                
                // If the line isn't used and the line above (if there is one) isn't used either
                if(this.pondLines[lineIndex].getIsUsed() == false && (lineIndex == 0 || this.pondLines[lineIndex-1].getIsUsed() == false)){
                    // Add a lolligator here
                    this.addPondLolligator(new PondLolligator(this.pondLines, lineIndex));
                }
            }
            
            // We update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private plantLollipops(howMany: number): void{
        // If we have enough lollipops
        if(this.getGame().getLollipops().getCurrent() >= howMany){
            this.getGame().getLollipops().add(-howMany);
            Saving.saveNumber("lollipopFarmLollipopsPlanted", Saving.loadNumber("lollipopFarmLollipopsPlanted") + howMany);
            this.getGame().calcLollipopFarmProduction();
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private stopFeedingLolligators(): void{
        // We set the bool
        Saving.saveBool("lollipopFarmPondFeedingLolligators", false);
        
        // We update
        this.update();
        this.getGame().updatePlace();
    }
    
    private update(): void{
        // Reset
        this.renderArea.resetAllButSize();
    
        // Draw the farm
        this.renderArea.drawArray(Database.getAscii("places/lollipopFarm/lollipopFarm"), 0, 5);
        
        // Draw the field stuff
        this.drawFieldStuff(1, 34);
        
        // Draw the mill stuff
        this.drawMillStuff(7, 0);
        
        // Draw the pond stuff
        this.drawPondStuff(50, 14);
    }
    
    private updatePondConversionRate(): void{
        Saving.saveNumber("lollipopFarmPondConversionRate", Math.ceil(Saving.loadNumber("lollipopFarmPondHowManyLolligators") * 3 + Math.pow(1.3, Saving.loadNumber("lollipopFarmPondHowManyLolligators"))));
    }
}
