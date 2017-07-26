///<reference path="TheCavePattern.ts"/>

class TheCavePattern_ArrowsToHeartPlug extends TheCavePattern{
    // Is the pattern stopped?
    private stopped: boolean = false;
    
    // Should we draw an arrow?
    private arrow: boolean = true;
    
    // Current arrow direction
    private arrowAtRight: boolean;
    
    // Number of times the player correctly followed the arrows
    private followedNumber: number = 0;
    
    // Did we find the heart plug?
    private foundPlug: boolean = false;
    
    // Did we get the heart plug? (true if the player clicked on it)
    private gotPlug: boolean = false;
    
    // Constructor
    constructor(theCave: TheCave){
        super(theCave);
        
        // Choose a random direction
        this.arrowAtRight = Random.flipACoin();
    }
    
    // Public methods
    public draw(renderArea: RenderArea, x: number, y: number): void{
        // If we should draw an arrow
        if(this.arrow){
            // Draw a different arrow depending on the direction
            if(this.arrowAtRight == true){
                renderArea.drawString("->", x+71, y+17);
            }
            else{
                renderArea.drawString("<-", x+26, y+17);
            }
        }
        
        // If we found the plug and didn't pick it up yet
        if(this.foundPlug == true && this.gotPlug == false){
            // Draw the plug ascii art
            renderArea.drawArray(Database.getAscii("places/theCave/heartPlug"), x+46, y+14);
            // Draw the button over the plug
            renderArea.addMultipleAsciiButtons("theCavePattern_ArrowsToHeartPlugButton", x+46, x+53, y+14, x+46, x+53, y+15);
            // Add the button link
            renderArea.addLinkCall(".theCavePattern_ArrowsToHeartPlugButton", new CallbackCollection(this.getPlug.bind(this)));
        }
    }
    
    public ended(): boolean{
        return this.stopped;
    }
    
    public getSentence(): string{
        // If we found the plug but didn't get it yet, we return the sentence
        if(this.foundPlug == true && this.gotPlug == false){
            return "theCavePattern_ArrowsToHeartPlugSeeStrangePlug";
        }
        
        // Else, we return null
        return null;
    }
    
    public move(type: TheCaveMoveType): void{
        // If the arrow is at right and we just went right or the arrow is at left and we just went left, we continue
        if((this.arrowAtRight == true && type == TheCaveMoveType.RIGHT) ||
           (this.arrowAtRight == false && type == TheCaveMoveType.LEFT)){
            // If we didn't find the plug yet
            if(this.foundPlug == false){
                // If we followed at least six arrows
                if(this.followedNumber > 6){
                    this.foundPlug = true;
                    this.arrow = false;
                }
                else{
                    // Possibly change the arrow direction
                    this.arrowAtRight = Random.flipACoin();
                    // Increase the followed number
                    this.followedNumber += 1;
                }
            }
            // Else, we found the plug, so we stop this pattern
            else this.stopped = true;
        }
        // Else, we stop
        else{
            this.stopped = true;
        }
    }
    
    // Private methods
    private getPlug(): void{
        // Get the plug
        this.getTheCave().getGame().gainItem("gridItemPossessedHeartPlug");
        this.gotPlug = true;
        
        // Ask the cave for an update
        this.getTheCave().aPatternNeedsUpdating();
    }
}