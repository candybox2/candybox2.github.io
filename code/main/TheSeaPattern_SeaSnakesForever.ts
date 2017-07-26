///<reference path="TheSeaPattern.ts"/>

class TheSeaPattern_SeaSnakesForever extends TheSeaPattern{
    // Variables
    private nextSnakeIn: number;
    private nextSharkIn: number;
    
    // Variables
    private addedRedSharkFin: boolean = false;
    private addedGreenSharkFin: boolean = false;
    private addedPurpleSharkFin: boolean = false;
    
    // Constructor
    constructor(theSea: TheSea, initialDistance: number){
        super(theSea, initialDistance);
        
        this.nextSnakeIn = 0;
        this.nextSharkIn = Random.between(0, 50);
    }
    
    // Public methods
    public isPatternDone(): boolean{
        return false;
    }
    
    public run(x1: number, x2: number): void{
        // Possibly add a snake
        this.nextSnakeIn -= 1;
        if(this.nextSnakeIn <= 0){
            this.getTheSea().addSeaSnake(new Pos(x2, Random.between(0, this.getTheSea().getRealQuestSize().y - this.getTheSea().getFloorMaxHeight() - 12)));
            this.nextSnakeIn = 85 - Math.ceil((1-Math.exp(-(this.getTheSea().getDistance() - this.getInitialDistance())/1500))*83);
        }
        
        // Possibly add a shark
        this.nextSharkIn -= 1;
        if(this.nextSharkIn <= 0){
            // Store the shark
            var shark: BigShark = this.getTheSea().addBigShark(new Pos(x2, Random.between(0, this.getTheSea().getRealQuestSize().y - this.getTheSea().getFloorMaxHeight() - 10)));
            
            // If a shark was added
            if(shark != null){
                if(Saving.loadBool("gridItemPossessedRedSharkFin") == false && this.addedRedSharkFin == false && this.getTheSea().getDistance() - this.getInitialDistance() > 150){
                    shark.hasFin(BigSharkFinType.RED);
                    this.addedRedSharkFin = true;
                }
                else if(Saving.loadBool("gridItemPossessedGreenSharkFin") == false && this.addedGreenSharkFin == false && this.getTheSea().getDistance() - this.getInitialDistance() > 700){
                    shark.hasFin(BigSharkFinType.GREEN);
                    this.addedGreenSharkFin = true;
                }
                else if(Saving.loadBool("gridItemPossessedPurpleSharkFin") == false && this.addedPurpleSharkFin == false && this.getTheSea().getDistance() - this.getInitialDistance() > 2500){
                    shark.hasFin(BigSharkFinType.PURPLE);
                    this.addedPurpleSharkFin = true;
                }
            }
            
            // Set the next shark in
            this.nextSharkIn = 60 - Math.ceil((1-Math.exp(-(this.getTheSea().getDistance() - this.getInitialDistance())/1500))*55);
        }
    }
}
