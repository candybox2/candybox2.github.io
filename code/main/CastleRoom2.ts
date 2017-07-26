///<reference path="CastleRoom.ts"/>

Saving.registerBool("castleRoom2LitFire", false);
Saving.registerBool("castleRoom2TookObject", false);

class CastleRoom2 extends CastleRoom{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // The smokes
    private smokes: Smoke[] = [];
    
    constructor(game: Game){
        super(game);
        
        // If needed, we add smokes
        if(Saving.loadBool("castleRoom2LitFire") == true){
            this.addSmokes();
        }
        
        this.renderArea.resize(100, 30);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    public willBeDisplayed(): void{
        this.getGame().getOneSecondCallbackCollection().addCallback(this.actionSmokes.bind(this));
    }
    
    // update()
    public update(): void{
        // Reset the area
        this.renderArea.resetAllButSize();
        
        // Add the button to go back to the castle
        this.addBackToTheCastleButton(this.renderArea, "castleRoom2BackToTheCastleButton");
        
        // If the fire isn't lit yet
        if(Saving.loadBool("castleRoom2LitFire") == false){
            // Draw the dark color
            this.drawDark(0, 3, 100, 27);
            
            // Add the button on the fire
            this.drawFireButton(42, 20);
        }
        // Else, the fire is lit
        else{
            // We draw the fire
            this.drawFire(42, 20);
            
            // If we didn't take the object yet
            if(Saving.loadBool("castleRoom2TookObject") == false){
                this.drawObject(21, 12);
            }
        }
    }
    
    // Private methods
    private actionSmokes(): void{
        // If there's at least one smoke
        if(this.smokes.length > 0){
            // We make the smokes move
            for(var i = 0; i < this.smokes.length; i++){
                this.smokes[i].move();
            }
            
            // We update on the page
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private addSmokes(): void{
        this.smokes.push(new Smoke(45, Random.between(20, 21), 11, Random.between(3, 7), 0, 5));
        this.smokes.push(new Smoke(45, Random.between(20, 21), 11, Random.between(2, 6), 0, 5));
        this.smokes.push(new Smoke(45, Random.between(20, 21), 11, Random.between(2, 6), 0, 5));
        this.smokes.push(new Smoke(45, Random.between(20, 21), 11, Random.between(2, 6), 0, 5));
        this.smokes.push(new Smoke(45, Random.between(20, 21), 11, Random.between(2, 6), 0, 5));
    }
    
    private drawDark(x: number, y: number, width: number, height: number): void{
        for(var i = y; i < y+height; i++){
            this.renderArea.addBackgroundColor(x, x+width, i, new Color(ColorType.CASTLE_DARK_ROOM, true));
        }
    }
    
    private drawFire(x: number, y: number): void{
        // Draw the fire ascii art
        this.renderArea.drawArray(Database.getAscii("places/castle/room2/fire"), x, y);
        
        // Draw the smokes
        for(var i = 0; i < this.smokes.length; i++){
            this.smokes[i].draw(this.renderArea);
        }
    }
    
    private drawFireButton(x: number, y: number): void{
        // Add the button
        this.renderArea.addMultipleAsciiButtons("castleRoom2LightFireButton",
                                               x, x+16, y,
                                               x, x+16, y+1,
                                               x, x+16, y+2,
                                               x, x+16, y+3,
                                               x, x+16, y+4,
                                               x, x+16, y+5);
        
        // Add the link
        this.renderArea.addLinkCall(".castleRoom2LightFireButton", new CallbackCollection(this.lightFire.bind(this)));
    }
    
    private drawObject(x: number, y: number): void{
        // Draw the ascii art
        this.renderArea.drawArray(Database.getAscii("places/castle/room2/pitchfork"), x, y);
        
        // Add the button
        this.renderArea.addMultipleAsciiButtons("castleRoom2TakeObjectButton",
                                                x+6, x+12, y,
                                                x+5, x+11, y+1,
                                                x+4, x+10, y+2,
                                                x+3, x+9, y+3,
                                                x+2, x+8, y+4,
                                                x+1, x+7, y+5,
                                                x+1, x+5, y+6,
                                                x, x+4, y+7);
        
        // Add the link
        this.renderArea.addLinkCall(".castleRoom2TakeObjectButton", new CallbackCollection(this.takeObject.bind(this)));
    }
    
    private lightFire(): void{
        // Change the bool
        Saving.saveBool("castleRoom2LitFire", true);
        
        // Add the smokes
        this.addSmokes();
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private takeObject(): void{
        // Set the bool
        Saving.saveBool("castleRoom2TookObject", true);
        
        // Take it
        this.getGame().gainItem("gridItemPossessedPitchfork");
        
        // Re-calc the farm production
        this.getGame().calcLollipopFarmProduction();
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
}