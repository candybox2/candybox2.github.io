///<reference path="TheSeaPattern.ts"/>

class TheSeaPattern_BigSharks extends TheSeaPattern{
    // Constructor
    constructor(theSea: TheSea, initialDistance: number){
        super(theSea, initialDistance);
    }
    
    // Public methods
    public isPatternDone(): boolean{
        if(this.getTheSea().getDistance() > this.getInitialDistance() + 125)
            return true;
        
        return false;
    }
    
    public run(x1: number, x2: number): void{
        if(this.getTheSea().getDistance() % 60 == 0)
            this.getTheSea().addBigShark(new Pos(x2, Random.fromArray([2, 6])));
    }
}
