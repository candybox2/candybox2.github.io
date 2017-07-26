class TheSeaPatternLevel{
    // The sea
    private theSea: TheSea;
    
    // How many patterns launched already ?
    private howManyPatterns: number = 0;
    
    // Constructor
    constructor(theSea: TheSea){
        this.theSea = theSea;
    }
    
    // Public methods
    public getNextLevel(): TheSeaPatternLevel{
        return new TheSeaPatternLevel(this.theSea);
    }
    
    public getPattern(initialDistance: number): TheSeaPattern{
        return new TheSeaPattern(this.theSea, initialDistance);
    }
    
    public increaseHowManyPatterns(): void{
        this.howManyPatterns += 1;
    }
    
    public isLevelDone(): boolean{
        return false;
    }
    
    // Public getters
    public getHowManyPatterns(): number{
        return this.howManyPatterns;
    }
    
    public getTheSea(): TheSea{
        return this.theSea;
    }
}
