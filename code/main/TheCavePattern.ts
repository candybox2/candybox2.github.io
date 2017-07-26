class TheCavePattern{
    // The cave
    private theCave: TheCave;
    
    // Constructor
    constructor(theCave: TheCave){
        this.theCave = theCave;
    }
    
    // Public methods
    public draw(renderArea: RenderArea, x: number, y: number): void{ // Called to let the pattern draw stuff
        
    }
    
    public ended(): boolean{ // Called to know if the pattern should end
        return false;
    }
    
    public getSentence(): string{ // Called so that the pattern can easily show a sentence below the cave ascii art
        return null;
    }
    
    public move(type: TheCaveMoveType): void{ // Called when the player moves
        
    }
    
    // Public getters
    public getTheCave(): TheCave{
        return this.theCave;
    }
}