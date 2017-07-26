///<reference path="TheSeaPattern.ts"/>

class TheSeaPattern_LotOfMiniSharks extends TheSeaPattern{
    // Variables
    private sharksAdded: boolean = false;
    
    // Constructor
    constructor(theSea: TheSea, initialDistance: number){
        super(theSea, initialDistance);
    }
    
    // Public methods
    public isPatternDone(): boolean{
        if(this.getTheSea().getDistance() > this.getInitialDistance() + 60)
            return true;
        return false;
    }
    
    public run(x1: number, x2: number): void{
        if(this.getTheSea().getDistance() > this.getInitialDistance() + 30 && this.sharksAdded == false){
            this.sharksAdded = true;
            this.getTheSea().addMiniShark(new Pos(x1 + Random.upTo(6), 2));
            this.getTheSea().addMiniShark(new Pos(x1 + Random.upTo(6), 8));
            this.getTheSea().addMiniShark(new Pos(x1 + Random.upTo(6), 14));
        }
    }
}
