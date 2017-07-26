///<reference path="StatusBarResource.ts"/>

class PainsAuChocolat extends StatusBarResource{
    // Constructor
    constructor(game: Game, savingPrefix: string){
        super(game, savingPrefix);
    }
    
    // Public methods
    public getCurrentAsString(totalSize: number = 10): string{
        var n: number = this.getCurrent();
        var size: number = totalSize;
        
        var base: string = "";
        var prefix: string = "";
        var suffix: string = "";
        
        // We set the base or return right now in some special cases
        if(n < 0)
            return "What, negative pains au chocolat?!";
        else if(n == 1)
            return "-> 1 pain au chocolat";
        else
            base = Algo.numberToStringButNicely(n);
        
        // How much space do we still have ?
        size = totalSize - base.length;
        
        // We set the suffix
        if(size >= 18){
            suffix = " pains au chocolat";
            
            // We add a suffix
                // How much space do we still have ?
                size = totalSize - base.length - suffix.length;
                
                // We set the prefix
                if(size >= 9) prefix = "You have ";
                else if(size >= 3) prefix = "-> ";
        }
        else if(size >= 3) suffix = " pc";
        
        // How much space do we still have ?
        size = totalSize - base.length - prefix.length - suffix.length;
        
        return prefix + base + suffix;
    }
}