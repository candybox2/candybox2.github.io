///<reference path="Place.ts"/>

Saving.registerNumber("cauldronBookCurrentPage", 0);

class Cauldron extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Maximum page
    private maxPage: number = 10;
    
    // The candies & lollipops in the input field
    private candiesInput: string = "";
    private lollipopsInput: string = "";
    
    // The comments next to candies and lollipops input fields (they're needed if the player types something which isn't a number, or which is a negative number)
    private candiesInputComment: string = null;
    private lollipopsInputComment: string = null;
    
    // What are we doing?
    private currentAction: CauldronAction = CauldronAction.NOTHING;
    
    // Current timer time
    private timerTime: number = 0;
    private timerIntervalID: number;
    
    // Action log
    private actionLog: CauldronActionLogEntry[] = [null, null, null, null, null]; // We always remember the last five actions
    
    // The comment telling the player the potions he managed to brew
    private potionsComment: string = null;
    
    // Array containing the flames we can see when heating up the cauldron
    private flames: CauldronFlame[] = [];
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Launch the interval and get the ID
        this.timerIntervalID = setInterval(this.actionInterval.bind(this), 1000);
        
        // Resize and update
        this.renderArea.resize(100, 57);
        this.update(true);
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // willBeDisplayed()
    public willBeDisplayed(): void{
        // We add hotkeys
        this.getGame().addHotkey(new Hotkey("a", new CallbackCollection(this.putInCauldron.bind(this))));
        this.getGame().addHotkey(new Hotkey("m", new CallbackCollection(this.changeAction.bind(this, CauldronAction.MIXING))));
        this.getGame().addHotkey(new Hotkey("b", new CallbackCollection(this.changeAction.bind(this, CauldronAction.BOILING))));
        this.getGame().addHotkey(new Hotkey("s", new CallbackCollection(this.changeAction.bind(this, CauldronAction.NOTHING))));
        this.getGame().addHotkey(new Hotkey("p", new CallbackCollection(this.putIntoBottles.bind(this))));
        this.getGame().addHotkey(new Hotkey("left", new CallbackCollection(this.previousPage.bind(this))));
        this.getGame().addHotkey(new Hotkey("right", new CallbackCollection(this.nextPage.bind(this))));
    }
    
    // willStopBeingDisplayed()
    public willStopBeingDisplayed(): void{
        clearInterval(this.timerIntervalID);
    }
    
    // Private methods
    private actionInterval(): void{
        // Increase the time
        this.timerTime += 1;
        
        // If we're boiling, update the flames array
        if(this.currentAction == CauldronAction.BOILING){
            this.updateFlamesArray();
        }
        
        // If we're not doing nothing, update
        if(this.currentAction != CauldronAction.NOTHING){
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private changeAction(newAction: CauldronAction): void{
        // If we're not already doing that
        if(this.currentAction != newAction){
            // If the action which just stopped wasn't nothing
            if(this.currentAction != CauldronAction.NOTHING){
                // Shift actions in the log
                for(var i = this.actionLog.length-1; i > 0; i--){
                    this.actionLog[i] = this.actionLog[i-1];
                }
                // Set actionLog[0] to the action which just stopped
                this.actionLog[0] = new CauldronActionLogEntry(this.currentAction, this.timerTime, this.getGame().getCandiesInCauldron().getCurrent(), this.getGame().getLollipopsInCauldron().getCurrent());
            }
            // Now we're doing that
            this.currentAction = newAction;
            // Reset the timer and restart the interval
            this.timerTime = 0;
            clearInterval(this.timerIntervalID);
            this.timerIntervalID = setInterval(this.actionInterval.bind(this), 1000);
            // We reset the flames array
            this.resetFlamesArray();
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private changeCandiesInput(): void{
        if($(".cauldronCandiesInput").length) // If the element exists
            this.candiesInput = $(".cauldronCandiesInput").val();
    }
    
    private changeLollipopsInput(): void{
        if($(".cauldronLollipopsInput").length) // If the element exists
            this.lollipopsInput = $(".cauldronLollipopsInput").val();
    }
    
    private drawActions(x: number, y: number, firstTimeWeUpdate: boolean, keepInputContent: boolean): void{
        // Variables
        var candiesInputHasFocus: boolean = false;
        var lollipopsInputHasFocus: boolean = false;
        
        // If it's not the first time we update, we need to keep some stuff from the page (content of the inputs + focus on the inputs)
        if(firstTimeWeUpdate == false){
            // If if the candies / lollipops input has the focus (in order to restore the focus after the page updating)
            candiesInputHasFocus = $(".cauldronCandiesInput").is(":focus");
            lollipopsInputHasFocus = $(".cauldronLollipopsInput").is(":focus");
            
            // Reset the content of candiesInput and lollipopsInput
            this.candiesInput = "";
            this.lollipopsInput = "";
        }
        
        // What you want to put in the cauldron
            // Text
            this.renderArea.drawString(Database.getText("cauldronWhatYouWantToPut"), x, y); // Normal
            this.renderArea.addBold(x, x + Database.getText("cauldronWhatYouWantToPut").length, y); // Add bold on normal
            this.renderArea.drawString(Database.getTranslatedText("cauldronWhatYouWantToPut"), x, y+1, true); // Translated
            // Candies input
            this.renderArea.addSimpleInput(x, x + 20, y+2, new CallbackCollection(this.changeCandiesInput.bind(this)), "cauldronCandiesInput", (keepInputContent? this.candiesInput: ""), candiesInputHasFocus);
            this.renderArea.drawString("candies", x + 21, y+2);
            if(this.candiesInputComment != null){
                this.renderArea.drawString(this.candiesInputComment, x + 29, y+2);
                this.renderArea.addBold(x + 29, x + 29 + this.candiesInputComment.length, y+2);
            }
            // Lollipops input
            this.renderArea.addSimpleInput(x, x + 20, y+4, new CallbackCollection(this.changeLollipopsInput.bind(this)), "cauldronLollipopsInput", (keepInputContent? this.lollipopsInput: ""), lollipopsInputHasFocus);
            this.renderArea.drawString("lollipops", x + 21, y+4);
            if(this.lollipopsInputComment != null){
                this.renderArea.drawString(this.lollipopsInputComment, x + 31, y+4);
                this.renderArea.addBold(x + 31, x + 31 + this.lollipopsInputComment.length, y+4);
            }
            // Put all that in the cauldron
            this.renderArea.addAsciiRealButton("Put all that in the cauldron", x, y+6, "cauldronPutAllThatInTheCauldronButton", "", false, 4);
            this.renderArea.addLinkCall(".cauldronPutAllThatInTheCauldronButton", new CallbackCollection(this.putInCauldron.bind(this)));
        
        // What is in the cauldron
            // Text
            this.renderArea.drawString(Database.getText("cauldronWhatIsIn"), x, y+9); // Normal
            this.renderArea.addBold(x, x + Database.getText("cauldronWhatIsIn").length, y+9); // Add bold on normal
            this.renderArea.drawString(Database.getTranslatedText("cauldronWhatIsIn"), x, y+10, true); // Translated
            // Candies
            this.renderArea.drawString("Candies :", x+2, y+11);
            this.renderArea.drawString(Algo.numberToStringButNicely(this.getGame().getCandiesInCauldron().getCurrent()), x + 14, y + 11);
            // Lollipops
            this.renderArea.drawString("Lollipops :", x+2, y+12);
            this.renderArea.drawString(Algo.numberToStringButNicely(this.getGame().getLollipopsInCauldron().getCurrent()), x + 14, y + 12);
        
        // What you can do with it
            // Text
            this.renderArea.drawString(Database.getText("cauldronWhatYouCanDo"), x, y+14); // Normal
            this.renderArea.addBold(x, x + Database.getText("cauldronWhatYouCanDo").length, y+14); // Add bold on normal
            this.renderArea.drawString(Database.getTranslatedText("cauldronWhatYouCanDo"), x, y+15, true); // Translated
            // Mix button
            this.renderArea.addAsciiRealButton("Mix", x, y+16, "cauldronMixButton", "", false, 0);
            this.renderArea.addLinkCall(".cauldronMixButton", new CallbackCollection(this.changeAction.bind(this, CauldronAction.MIXING)));
            // Boil button
            this.renderArea.addAsciiRealButton("Boil", x+5, y+16, "cauldronBoilButton", "", false, 0);
            this.renderArea.addLinkCall(".cauldronBoilButton", new CallbackCollection(this.changeAction.bind(this, CauldronAction.BOILING)));
            // Stop button
            this.renderArea.addAsciiRealButton("Stop", x+11, y+16, "cauldronStopButton", "", false, 0);
            this.renderArea.addLinkCall(".cauldronStopButton", new CallbackCollection(this.changeAction.bind(this, CauldronAction.NOTHING)));
            // Show what we're doing
            switch(this.currentAction){
                case CauldronAction.MIXING:
                    this.renderArea.drawString("Mixing" + this.getSpecialMixingText(), x, y+18);
                break;
                case CauldronAction.BOILING:
                    this.renderArea.drawString("Boiling" + this.getSpecialBoilingText(), x, y+18);
                break;
            }
            // Put into bottles if we're not questing
            if(this.getGame().getWeAreQuesting() == false){
                this.renderArea.addAsciiRealButton("Put into bottles", x, y+20, "cauldronPutIntoBottlesButton", "", false, 0);
                this.renderArea.addLinkCall(".cauldronPutIntoBottlesButton", new CallbackCollection(this.putIntoBottles.bind(this)));
            }
            else{
                this.renderArea.drawString("You can't put into bottles while you're in a quest", x, y+20);
            }
            // The comment
            if(this.potionsComment != null)
                this.renderArea.drawString(this.potionsComment, x, y+22);
    }
    
    private drawBook(x: number, y: number): void{
        // Draw the book
        this.renderArea.drawArray(Database.getAscii("places/cauldron/book"), x, y);
        
        // Draw the pages' content
        this.renderArea.drawArray(Database.getAscii("places/cauldron/bookPage" + Saving.loadNumber("cauldronBookCurrentPage")), x+8, y+1);
        this.renderArea.drawArray(Database.getAscii("places/cauldron/bookPage" + (Saving.loadNumber("cauldronBookCurrentPage")+1)), x+50, y+1);
        
        // Add the previous page button if we're not already at the first page
        if(Saving.loadNumber("cauldronBookCurrentPage") > 0){
            this.renderArea.addAsciiRealButton(Database.getText("cauldronPreviousPageButton"), x, y+31, "cauldronPreviousPageButton", Database.getTranslatedText("cauldronPreviousPageButton"), true, -1, null, false);
            this.renderArea.addLinkCall(".cauldronPreviousPageButton", new CallbackCollection(this.previousPage.bind(this)));
        }
        
        // Add the next page button if we're not already at the last page
        if(Saving.loadNumber("cauldronBookCurrentPage") < this.maxPage){
            this.renderArea.addAsciiRealButton(Database.getText("cauldronNextPageButton"), x+87, y+31, "cauldronNextPageButton", Database.getTranslatedText("cauldronNextPageButton"), true, -1, null, false, true);
            this.renderArea.addLinkCall(".cauldronNextPageButton", new CallbackCollection(this.nextPage.bind(this)));
        }
        
        // Add the translation if there is one
        if(Database.isTranslated()){
            // Buttons on the left page
            for(var i = 1; i < 28; i++){
                this.renderArea.addAsciiNinjaButton(x+7, x+48, i, "cauldronLeftPageTranslationButton");
            }
            // Buttons on the right page
            for(var i = 1; i < 28; i++){
                this.renderArea.addAsciiNinjaButton(x+49, x+90, i, "cauldronRightPageTranslationButton");
            }
            // Tooltips
            this.renderArea.addTooltip("cauldronLeftPageTranslationButtonTooltip", Database.getTranslatedText("cauldron.page" + Saving.loadNumber("cauldronBookCurrentPage")));
            this.renderArea.addTooltip("cauldronRightPageTranslationButtonTooltip", Database.getTranslatedText("cauldron.page" + (Saving.loadNumber("cauldronBookCurrentPage")+1)));
            // Links
            this.renderArea.addLinkOnHoverShowTooltip(".cauldronLeftPageTranslationButton", ".cauldronLeftPageTranslationButtonTooltip");
            this.renderArea.addLinkOnHoverShowTooltip(".cauldronRightPageTranslationButton", ".cauldronRightPageTranslationButtonTooltip");
        }
    }
    
    private drawCauldron(x: number, y: number): void{
        // Draw the cauldron
        this.renderArea.drawArray(Database.getAscii("places/cauldron/cauldron"), x, y);
        
        // Draw the flames
        for(var i = 0; i < this.flames.length; i++){
            this.flames[i].draw(this.renderArea, x, y);
        }
    }
    
    private getSpecialBoilingText(): string{
        if(this.timerTime < 3) return "... cold.";
        else if(this.timerTime < 6) return "... lukewarm.";
        else if(this.timerTime == 6) return "... hot.";
        else if(this.timerTime == 7) return "... hot..";
        else if(this.timerTime == 8) return "... hot...";
        else if(this.timerTime == 9) return "... very hot.";
        else if(this.timerTime == 10) return "... very hot..";
        else if(this.timerTime == 11) return "... very hot...";
        else if(this.timerTime < 14) return "... bubbles begin to appear.";
        else if(this.timerTime == 14) return "... bubbles begin to appear..";
        else if(this.timerTime == 15) return "... bubbles begin to appear...";
        else if(this.timerTime == 16) return "... bubbles begin to appear... and..";
        else if(this.timerTime == 17) return "... bubbles begin to appear... and...";
        else if(this.timerTime < 50) return "... BOILING!";
        else return "... the water is burnt. How is that possible?!";
    }
    
    private getSpecialMixingText(): string{
        if(this.timerTime < 60)
            return "... (" + this.timerTime + ")";
        else
            return "... your arms are hurting :(";
    }
    
    private makePotions(boolSavingName: string, numberSavingName: string, howMany: number, singularPotionName: string, pluralPotionName: string): void{
        // We can now use this kind of potion
        Saving.saveBool(boolSavingName, true);
        
        // We increase the quantity
        Saving.saveNumber(numberSavingName, Saving.loadNumber(numberSavingName) + howMany);
        
        // We set the comment
        this.potionsComment = "You made " + Algo.pluralFormat(howMany, " " + singularPotionName, " " + pluralPotionName) + ".";
    }
    
    private nextPage(): void{
        // If we can go to the next page
        if(Saving.loadNumber("cauldronBookCurrentPage") < this.maxPage){
            // Change the current page number
            Saving.saveNumber("cauldronBookCurrentPage", Saving.loadNumber("cauldronBookCurrentPage") + 2);
            
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private previousPage(): void{
        // If we can go to the previous page
        if(Saving.loadNumber("cauldronBookCurrentPage") > 0){
            // Change the current page number
            Saving.saveNumber("cauldronBookCurrentPage", Saving.loadNumber("cauldronBookCurrentPage") - 2);
            
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private putInCauldron(): void{
        // Used to know if we will have to update and return
        var updateAndReturn: boolean = false;
        
        // Parse the inputs and put them in two variables
        var candies: number = (this.candiesInput == ""? 0 : parseInt(this.candiesInput));
        var lollipops: number = (this.lollipopsInput == ""? 0 : parseInt(this.lollipopsInput));
        
        // Reset the comments
        this.candiesInputComment = null;
        this.lollipopsInputComment = null;
        
        // If the candies are incorrect, set the comment and return
        if(isNaN(candies)){
            this.candiesInputComment = "(this isn't a number!)";
            updateAndReturn = true;
        }
        else if(candies < 0){
            this.candiesInputComment = "(must be positive)";
            updateAndReturn = true;
        }
        else if(candies > this.getGame().getCandies().getCurrent()){
            this.candiesInputComment = "(not enough candies)";
            updateAndReturn = true;
        }
        
        // If the lollipops are incorrect, set the comment and return
        if(isNaN(lollipops)){
            this.lollipopsInputComment = "(this isn't a number!)";
            updateAndReturn = true;
        }
        else if(lollipops < 0){
            this.lollipopsInputComment = "(must be positive)";
            updateAndReturn = true;
        }
        else if(lollipops > this.getGame().getLollipops().getCurrent()){
            this.lollipopsInputComment = "(not enough lollipops)";
            updateAndReturn = true;
        }
        
        // If we have to update and return, well, we do that
        if(updateAndReturn){
            this.update();
            this.getGame().updatePlace();
            return;
        }
        // Else, we put the candies & lollipops in the cauldron
        else{
            // Take the candies & lollipops
            this.getGame().getCandies().add(-candies);
            this.getGame().getLollipops().add(-lollipops);
            // Put all the stuff
            this.getGame().getCandiesInCauldron().add(candies);
            this.getGame().getLollipopsInCauldron().add(lollipops);
            // Update
            this.update(false, false);
            this.getGame().updatePlace();
        }
    }
    
    private putIntoBottles(): void{
        // Reset the potions comment
        this.potionsComment = null;
        
        // Stop any action
        this.changeAction(CauldronAction.NOTHING);
        
        // Take the candies & lollipops in the cauldron
        this.getGame().getCandiesInCauldron().add(-this.getGame().getCandiesInCauldron().getCurrent());
        this.getGame().getLollipopsInCauldron().add(-this.getGame().getLollipopsInCauldron().getCurrent());
        
        // Health potion check
        if(this.actionLog[0] != null && // There's a last action
           this.actionLog[0].getAction() == CauldronAction.MIXING && // It was mixing
           this.actionLog[0].getLollipops() == 0 && // We didn't use any lollipop
           this.actionLog[0].getCandies() > 0 && // We used at least one candy
           this.actionLog[0].getCandies() % 100 == 0 && // We used a multiple of 100 candies
           this.actionLog[0].getTime() < 30){ // We mixed for less than 30 seconds
            this.makePotions("questPlayerSpellHealthPotionHasSpell", "questPlayerSpellHealthPotionQuantity", this.actionLog[0].getCandies()/100, "health potion", "health potions");
        }
        
        // Turtle potion check
        else if(this.actionLog[1] != null && // There's a last last action
            this.actionLog[1].getAction() == CauldronAction.MIXING && // It was mixing
            this.actionLog[1].getCandies() > 0 && // We used at least one candy
            this.actionLog[1].getLollipops() > 0 && // We used at least one lollipop
            this.actionLog[1].getCandies() % 50 == 0 && // We used a multiple of 50 candies
            this.actionLog[1].getLollipops() % 500 == 0 && // We used a multiple of 500 lollipops
            this.actionLog[1].getLollipops() == 10 * this.actionLog[1].getCandies() && // We used 10 times more lollipops than candies
            this.actionLog[1].getTime() > 6 && // We mixed for more than 6 seconds
            this.actionLog[1].getTime() < 14 && // We mixed for less than 14 seconds
            this.actionLog[0] != null && // There's a last action
            this.actionLog[0].getAction() == CauldronAction.MIXING && // It was mixing
            this.actionLog[0].getCandies() == 2 * this.actionLog[1].getCandies() && // We used twice more candies than in the previous action
            this.actionLog[0].getLollipops() == this.actionLog[1].getLollipops()){ // We used as many lollipops as in the previous action
             this.makePotions("questPlayerSpellTurtlePotionHasSpell", "questPlayerSpellTurtlePotionQuantity", this.actionLog[0].getLollipops()/500, "turtle potion", "turtle potions");
        }
        
        // Anti-gravity potion check
        else if(this.actionLog[1] != null && // There's a last last action
            this.actionLog[1].getAction() == CauldronAction.BOILING && // It was boiling
            this.actionLog[1].getLollipops() == 0 && // We didn't use any lollipop
            this.actionLog[1].getCandies() > 0 && // We used at least one candy
            this.actionLog[1].getCandies() % 1000 == 0 && // We used a multiple of 1000 candies
            this.actionLog[1].getTime() >= 3 && this.actionLog[1].getTime() < 6 && // The water was lukewarm when we stopped boiling
            this.actionLog[0] != null && // There's a last action
            this.actionLog[0].getAction() == CauldronAction.BOILING && // It was boiling
            this.actionLog[0].getLollipops() == 0 && // There were still no lollipops
            this.actionLog[0].getCandies() == 2 * this.actionLog[1].getCandies() && // There were twice more candies than in the previous action
            this.actionLog[0].getTime() > 17){ // The water was boiling when we stopped boiling
             this.makePotions("questPlayerSpellAntiGravityPotionHasSpell", "questPlayerSpellAntiGravityPotionQuantity", this.actionLog[1].getCandies()/200, "anti-gravity potion", "anti-gravity potions");
        }
        
        // Berserk & cloning potion check
        else if(this.actionLog[0] != null && // There's a last action
            this.actionLog[0].getAction() == CauldronAction.MIXING && // It was mixing
            this.actionLog[0].getLollipops() > 0 && // We used at least one lollipop
            this.actionLog[0].getLollipops() % 20000 == 0 && // We used a multiple of 20000 lollipops
            this.actionLog[0].getTime() >= 60){ // We mixed until our arms were hurting
            // If we didn't use any candy, then we made berserk potions
            if(this.actionLog[0].getCandies() == 0){
                this.makePotions("questPlayerSpellBerserkPotionHasSpell", "questPlayerSpellBerserkPotionQuantity", this.actionLog[0].getLollipops()/20000, "berserk potion", "berserk potions");
            }
            // Else, we made cloning potions
            else{
                this.makePotions("questPlayerSpellCloningPotionHasSpell", "questPlayerSpellCloningPotionQuantity", this.actionLog[0].getLollipops()/20000, "cloning potion", "cloning potions");
            }
        }
        
        // P potion check
        else if(this.actionLog[2] != null && // There's a last last last action
            this.actionLog[2].getAction() == CauldronAction.MIXING && // It was mixing
            this.actionLog[2].getLollipops() == 0 && // We used no lollipop
            this.actionLog[2].getCandies() > 0 && // We used at least one candy
            this.actionLog[2].getCandies() % 500 == 0 && // We used a multiple of 500 candies
            this.actionLog[2].getTime() < 30 && // We mixed for less than 30 seconds
            this.actionLog[1] != null && // There was a last last action
            this.actionLog[1].getLollipops() == 0 && // We still used no lollipop
            this.actionLog[1].getCandies() == this.actionLog[2].getCandies() + 100 * this.actionLog[2].getTime() && // We used the number of candies in the last last last action plus 100 times the number of seconds we mixed before
            this.actionLog[1].getAction() == CauldronAction.BOILING && // This aciton was boiling
            this.actionLog[1].getTime() >= 3 && this.actionLog[1].getTime() < 6 && // The water was lukewarm when we stopped boiling
            this.actionLog[0] != null && // There was a last action
            this.actionLog[0].getAction() == CauldronAction.MIXING && // It was mixing
            this.actionLog[0].getCandies() == this.actionLog[1].getCandies() && // We didn't add any candy
            this.actionLog[0].getLollipops() > 0){ // We add at least one lollipop
             this.makePotions("questPlayerSpellPPotionHasSpell", "questPlayerSpellPPotionQuantity", Math.ceil(this.actionLog[1].getCandies()/500 + this.actionLog[0].getLollipops()/1000), "P potion", "P potions");
        }
        
        // X potion check
        else if(this.actionLog[4] != null && this.actionLog[3] != null && this.actionLog[2] != null && this.actionLog[1] != null && this.actionLog[0] != null && // There are five last actions
            this.actionLog[4].getAction() == CauldronAction.BOILING && // All
            this.actionLog[3].getAction() == CauldronAction.BOILING && // the
            this.actionLog[2].getAction() == CauldronAction.BOILING && // actions
            this.actionLog[1].getAction() == CauldronAction.BOILING && // are
            this.actionLog[0].getAction() == CauldronAction.BOILING && // boiling.
            this.actionLog[4].getTime() < 3 && // All the
            this.actionLog[3].getTime() < 3 && // actions
            this.actionLog[2].getTime() < 3 && // are
            this.actionLog[1].getTime() < 3 && // cold
            this.actionLog[0].getTime() >= 6 && // except the last one!
            this.actionLog[4].getLollipops() == 0 && this.actionLog[4].getCandies() == 1 && // No lollipop, 1 candy
            this.actionLog[3].getLollipops() == 0 && this.actionLog[3].getCandies() == 2 && // No lollipop, 1 candy
            this.actionLog[2].getLollipops() == 0 && this.actionLog[2].getCandies() == 3 && // No lollipop, 1 candy
            this.actionLog[1].getLollipops() == 0 && this.actionLog[1].getCandies() == 4 && // No lollipop, 1 candy
            this.actionLog[0].getLollipops() == 1 && this.actionLog[0].getCandies() == 4){ // No lollipop, 1 candy
             this.makePotions("questPlayerSpellXPotionHasSpell", "questPlayerSpellXPotionQuantity", 1, "X potion", "X potions");
        }
        
        // If the potions comment is null, it means we didn't manage to make anything
        if(this.potionsComment == null)
            this.potionsComment = "You didn't manage to make anything.";
        
        // Reset the action log
        for(var i = 0; i < this.actionLog.length; i++){
            this.actionLog[i] = null;
        }
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private resetFlamesArray(): void{
        this.flames = [];
    }
    
    private update(firstTimeWeUpdate: boolean = false, keepInputContent: boolean = true): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Draw everything
        this.drawBook(2, 0);
        this.drawCauldron(2, 39);
        this.drawActions(47, 34, firstTimeWeUpdate, keepInputContent);
    }
    
    private updateFlamesArray(): void{
        // Create the variables
        var minX: number = 0;
        var maxX: number = 41;
        var minY: number;
        var maxY: number = 14;
        var howManyFlames: number;
        var x: number;
        var y: number;
        
        // Calculate minY
        minY = 14 - this.timerTime;
        if(minY < 5) minY = 5;
        
        // Caulcate howManyFlames
        howManyFlames = this.timerTime * 25;
        if(howManyFlames > 200) howManyFlames = 200;
        
        // Reset the array
        this.resetFlamesArray();
        
        // If we're boiling
        if(this.currentAction = CauldronAction.BOILING){
            // Add flames depending on the current timer time
            for(var i = 0; i < howManyFlames; i++){
                // Set y
                y = null;
                for(var j = maxY; j > minY; j--){
                    if(Random.oneChanceOutOf(3)){
                        y = j;
                        break;
                    }
                }
                if(y == null) y = maxY;
                // Set x
                x = Random.between(minX + (14-y), maxX - (14-y));
                // Add the flame
                this.flames.push(new CauldronFlame(new Pos(x, y), Random.fromArray([")", "(", "`", "'", "."])));
            }
        }
    }
}