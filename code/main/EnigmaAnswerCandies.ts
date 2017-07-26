///<reference path="EnigmaAnswer.ts"/>

class EnigmaAnswerCandies extends EnigmaAnswer{
    // The game
    private game: Game;
    
    // Constructor
    constructor(game: Game){
        super();
        
        this.game = game;
    }
    
    // Public methods
    public isRight(answer: string): boolean{
        // If the answer is the current number of candies we possess
        if(Algo.simplifyString(answer) == this.game.getCandies().getCurrent().toString() ||
           Algo.simplifyString(answer) == (this.game.getCandies().getCurrent()+1).toString() ||
           Algo.simplifyString(answer) == (this.game.getCandies().getCurrent()+2).toString() ||
           Algo.simplifyString(answer) == (this.game.getCandies().getCurrent()+3).toString() ||
           Algo.simplifyString(answer) == (this.game.getCandies().getCurrent()-1).toString() ||
           Algo.simplifyString(answer) == (this.game.getCandies().getCurrent()-2).toString() ||
           Algo.simplifyString(answer) == (this.game.getCandies().getCurrent()-3).toString()
        )
            return true;
        
        // The answer isn't correct
        return false;
    }
}
