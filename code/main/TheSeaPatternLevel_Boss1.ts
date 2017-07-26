///<reference path="TheSeaPatternLevel.ts"/>

class TheSeaPatternLevel_Boss1 extends TheSeaPatternLevel{
    // Constructor
    constructor(theSea: TheSea){
        super(theSea);
    }
    
    // Public methods
    public getNextLevel(): TheSeaPatternLevel{
        return new TheSeaPatternLevel_Level2(this.getTheSea());
    }
    
    public getPattern(initialDistance: number): TheSeaPattern{
        this.increaseHowManyPatterns();
        
        return new TheSeaPattern_Boss1_Seahorses(this.getTheSea(), initialDistance);
    }
    
    public isLevelDone(): boolean{
        if(this.getHowManyPatterns() >= 1)
            return true;
        return false;
    }
}
