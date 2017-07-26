///<reference path="StatusBarResource.ts"/>

class CandiesEaten extends StatusBarResource{
    // Constructor
    constructor(game: Game, savingPrefix: string){
        super(game, savingPrefix);
    }
    
    // Public methods
    public getCurrentAsString(): string{
        var n: number = this.getCurrent();
        
        if(n < 0)
            return "You have eaten negative candies ?!";
        else if(n == 1)
            return "You have eaten 1 candy";
        else{
            return "You have eaten " + Algo.numberToStringButNicely(n) + " candies";
        }
    }
    
    // Public setters
    public setCurrent(n: number): void{
        super.setCurrent(n, true);
    }
}