///<reference path="CastleRoom.ts"/>

Saving.registerBool("castleTowerFirstVisitDone", false); // True if we already visited the tower at least once

// The following bools are true if we placed the corresponding stones in the tower
Saving.registerBool("castleTowerPStoneDone", false);
Saving.registerBool("castleTowerLStoneDone", false);
Saving.registerBool("castleTowerAStoneDone", false);
Saving.registerBool("castleTowerYStoneDone", false);

// Another one
Saving.registerBool("castleTowerTookTalkingCandy", false);

class CastleTower extends CastleRoom{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // The timer used when we first visit the tower (to produce a cool cut-scene)
    private cutSceneTimer: number;
    private cutSceneMaxTimer: number;
    
    // The interval ID used if we use the cut scene
    private intervalID: number;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Byt default, the interval ID is set to null
        this.intervalID = null;
        
        // Set the cut scene max timer
        this.cutSceneMaxTimer = 72;
        
        // If it's the first time we visit the tower, we change the bool, set the timer and start the interval
        if(Saving.loadBool("castleTowerFirstVisitDone") == false){
            Saving.saveBool("castleTowerFirstVisitDone", true);
            this.cutSceneTimer = 0;
            this.intervalID = setInterval(this.actionInterval.bind(this), 100);
        }
        // Else, we set the timer to the max timer value, no need to use it
        else{
            this.cutSceneTimer = this.cutSceneMaxTimer;
        }
        
        this.renderArea.resize(100, 38);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // willStopBeingDisplayed()
    public willStopBeingDisplayed(): void{
        // Clear the interval if the interval ID isn't null
        if(this.intervalID != null)
            clearInterval(this.intervalID);
    }
    
    // Private methods
    private actionInterval(): void{
        // If the timer hasn't reached the max timer yet, we increase it and update
        if(this.cutSceneTimer < this.cutSceneMaxTimer){
            this.cutSceneTimer += 1;
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private clickedOnStone(ourSavingName: string): void{
        // This stone is now in the tower
        Saving.saveBool(ourSavingName, true);
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private drawBackground(): void{
        // Calculate the gap
        var gap: number = (this.cutSceneMaxTimer - this.cutSceneTimer);
        if(gap > 60) gap = 60;
        
        // Draw the background ascii art
        this.renderArea.drawArray(Database.getAscii("places/castle/tower/castleTower"), 5, 3 - gap);
    }
    
    private drawTalkingCandy(): void{
        // If all the stones are in the tower AND we didn't already take the talking candy, we draw the key
        if(Saving.loadBool("castleTowerPStoneDone") && Saving.loadBool("castleTowerLStoneDone") && Saving.loadBool("castleTowerAStoneDone") && Saving.loadBool("castleTowerYStoneDone") && Saving.loadBool("castleTowerTookTalkingCandy") == false){
            // Draw the ascii art
            this.renderArea.drawArray(Database.getAscii("places/castle/tower/talkingCandy"), 47, 22);
            
            // Draw the button
            this.renderArea.addMultipleAsciiButtons("castleTowerTalkingCandyButton",
                                                    47, 50, 22,
                                                    47, 50, 23);
            this.renderArea.addLinkCall(".castleTowerTalkingCandyButton", new CallbackCollection(this.takeTalkingCandy.bind(this)));
        }
    }
    
    private drawStone(savingName: string, ourSavingName: string, asciiArtName: string, pos: Pos): void{
        // If we have the stone but it isn't in the tower yet
        if(Saving.loadBool(savingName) == true && Saving.loadBool(ourSavingName) == false){
            // We add the button to click on the stone
            this.renderArea.addMultipleAsciiButtons("castleTower" + savingName + "Button",
                                                   pos.x + 3, pos.x + 8, pos.y,
                                                   pos.x + 2, pos.x + 9, pos.y + 1,
                                                   pos.x + 1, pos.x + 10, pos.y + 2,
                                                   pos.x + 2, pos.x + 9, pos.y + 3,
                                                   pos.x + 3, pos.x + 8, pos.y + 4);
            // Add the link
            this.renderArea.addLinkCall(".castleTower" + savingName + "Button", new CallbackCollection(this.clickedOnStone.bind(this, ourSavingName)));
        }
        // Else, if we have the stone and it is in the tower
        else if(Saving.loadBool(savingName) == true && Saving.loadBool(ourSavingName) == true){
            // We draw the stone ascii art on the specified position
            this.renderArea.drawArray(Database.getAscii(asciiArtName), pos.x, pos.y-1);
        }
    }
    
    private drawStones(): void{
        // Calculate the gap
        var gap: number = (this.cutSceneMaxTimer - this.cutSceneTimer);
        if(gap > 60) gap = 60;
        
        // Draw the stones
        this.drawStone("gridItemPossessedP", "castleTowerPStoneDone", "gridItems/p", new Pos(25, 26 - gap));
        this.drawStone("gridItemPossessedL", "castleTowerLStoneDone", "gridItems/l", new Pos(38, 26 - gap));
        this.drawStone("gridItemPossessedA", "castleTowerAStoneDone", "gridItems/a", new Pos(51, 26 - gap));
        this.drawStone("gridItemPossessedY", "castleTowerYStoneDone", "gridItems/y", new Pos(64, 26 - gap));
    }
    
    private takeTalkingCandy(): void{
        // We take the candy
        Saving.saveBool("castleTowerTookTalkingCandy", true);
        
        // We gain the corresponding item
        this.getGame().gainItem("gridItemPossessedTalkingCandy")
        
        // We update
        this.update();
        this.getGame().updatePlace();
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToTheCastleButton(this.renderArea, "castleTowerBackToTheCastleButton");
        
        // Draw the background
        this.drawBackground();
        
        // Draw the stones related stuff
        this.drawStones();
        
        // Draw the talking candy related stuff
        this.drawTalkingCandy();
    }
}