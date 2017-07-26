module Bugs{
    // Variables
    var graphicalBugLevel: number = 0;
    var questBugLevel: number = 0;
    var ultimateBugLevel: number = 0;
    
    // Various functions
    export function changeRandomCharacter(str: string): string{
        var index: number = Random.between(0, str.length-1);
        return str.substr(0, index) + getRandomCharacter() + str.substr(index + 1);
    }
    
    export function getRandomCharacter(): string{
        return Random.fromArray(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                                 "#", "_", "/", "-", "+", "*", "^", ";", ",", ".", ":", "!", "§", "$", "£", "ù", "è", "à", "@", ")", "(", "|", "]", "}", "{", "(",
                                 "~", "é", "<", ">", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "%", "`", "'", "ç"]);
    }
    
    // Getters
    export function getGraphicalBugLevel(): number{
        return graphicalBugLevel;
    }
    
    export function getQuestBugLevel(): number{
        return questBugLevel;
    }
    
    export function getUltimateBugLevel(): number{
        return ultimateBugLevel;
    }
    
    // Setters    
    export function setGraphicalBugLevel(graphicalBugLevel_: number): void{
        graphicalBugLevel = graphicalBugLevel_;
    }
    
    export function setQuestBugLevel(questBugLevel_: number): void{
        questBugLevel = questBugLevel_;
    }
    
    export function setUltimateBugLevel(ultimateBugLevel_: number): void{
        ultimateBugLevel = ultimateBugLevel_;
    }
}