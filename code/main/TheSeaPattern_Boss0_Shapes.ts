///<reference path="TheSeaPattern.ts"/>

class TheSeaPattern_Boss0_Shapes extends TheSeaPattern{
    // Fishes of the squares
    private fishes: QuestEntity[] = [];
    
    // Did we add the fishes already ?
    private fishesAdded: boolean = false;
    
    // Are fishes moving right now ?
    private fishesAreMoving: boolean = true;
    
    // Shape type
    private shapeType: number;
    
    // Constructor
    constructor(theSea: TheSea, initialDistance: number){
        super(theSea, initialDistance);
        
        // Set the shape type
        this.shapeType = Random.upTo(2);
    }
    
    // Public methods    
    public isPatternDone(): boolean{
        if(this.getTheSea().getDistance() > this.getInitialDistance() + 50)
            return true;
        return false;
    }
    
    public run(x1: number, x2: number): void{
        // If it's time to add the fishes
        if(this.fishesAdded == false && this.getTheSea().getDistance() > this.getInitialDistance() + 30){
            this.fishesAdded = true;
            this.addShape(x1, 1);
            this.addShape(x1, 8);
            this.addShape(x1, 15);
            this.addShape(x1+15, 0);
            this.addShape(x1+15, 7);
            this.addShape(x1+15, 14);
            this.addShape(x1+30, 1);
            this.addShape(x1+30, 8);
            this.addShape(x1+30, 15);
        }
        
        // Handle fishes movement (to make them stop if the player stop moving)
        this.handleFishesMovement();
    }
    
    // Private methods
    private addFish(smallestFish: SmallestFish): void{
        if(smallestFish != null)
            this.fishes.push(smallestFish);
    }
    
    private addCross(x: number, y: number): void{
        this.addFish(this.getTheSea().addSmallestFish(new Pos(x, y+1)));
        this.addFish(this.getTheSea().addSmallestFish(new Pos(x+3, y+2)));
        this.addFish(this.getTheSea().addSmallestFish(new Pos(x+6, y+3)));
        this.addFish(this.getTheSea().addSmallestFish(new Pos(x+9, y+4)));
        this.addFish(this.getTheSea().addSmallestFish(new Pos(x, y+4)));
        this.addFish(this.getTheSea().addSmallestFish(new Pos(x+3, y+3)));
        this.addFish(this.getTheSea().addSmallestFish(new Pos(x+6, y+2)));
        this.addFish(this.getTheSea().addSmallestFish(new Pos(x+9, y+1)));
    }
    
    private addLines(x: number, y: number): void{
        for(var i = x; i <= x+9; i+=3){
            for(var j = y; j <= y+4; j += 2){
                this.addFish(this.getTheSea().addSmallestFish(new Pos(i, j)));
            }
        }
    }
    
    private addShape(x: number, y: number): void{
        // Call a random shape method
        switch(this.shapeType){
            case 0: this.addSquare(x, y); break;
            case 1: this.addLines(x, y); break;
            case 2: this.addCross(x, y); break;
        }
    }
    
    private addSquare(x: number, y: number): void{
        // Top & bottom
        for(var i = x; i <= x+9; i+=3){
            // Top of the square
            this.addFish(this.getTheSea().addSmallestFish(new Pos(i, y)));
            // Bottom of the square
            this.addFish(this.getTheSea().addSmallestFish(new Pos(i, y+5)));
        }
        
        // Left & right
        for(var j = y; j <= y+4; j++){
            // Left of the square
            this.addFish(this.getTheSea().addSmallestFish(new Pos(x, j)));
            // Right of the square
            this.addFish(this.getTheSea().addSmallestFish(new Pos(x+9, j)));
        }
    }
    
    private handleFishesMovement(): void{
        // If fishes are moving but shouldn't be
        if(this.fishesAreMoving == true && this.getTheSea().getLastPlayerMovement().x == 0 && this.getTheSea().getGame().getPlayer().getGlobalPosition().y >= 20){
            // Fishes are not moving any more
            this.fishesAreMoving = false;
            for(var i = 0; i < this.fishes.length; i++){
                this.fishes[i].setQuestEntityMovement(new QuestEntityMovement(new Pos(0, 0)));
            }
        }
        // Else, if fishes aren't moving but should be
        else if(this.fishesAreMoving == false && (this.getTheSea().getLastPlayerMovement().x > 0 || this.getTheSea().getGame().getPlayer().getGlobalPosition().y < 20)){
            // Fishes are now moving
            this.fishesAreMoving = true;
            for(var i = 0; i < this.fishes.length; i++){
                this.fishes[i].setQuestEntityMovement(new QuestEntityMovement(new Pos(-1, 0)));
            }
        }
    }
}
