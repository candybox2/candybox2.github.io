///<reference path="EnigmaAnswer.ts"/>

class EnigmaAnswerStrings extends EnigmaAnswer{
    // The array of valid strings for answering
    private validStrings: string[];
    
    // Constructor
    constructor(validStrings: string[]){
        super();
        
        this.validStrings = validStrings;
    }
    
    // Public methods
    public isRight(answer: string): boolean{
        for(var i = 0; i < this.validStrings.length; i++){
            if(Algo.simplifyString(answer) == this.validStrings[i]){
                // The answer is correct
                return true;
            }
        }
        
        // The answer isn't correct
        return false;
    }
}
