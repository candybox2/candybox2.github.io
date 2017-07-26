///<reference path="Resource.ts"/>

class StatusBarResource extends Resource{
    private game: Game;
    
    // Constructor
    constructor(game: Game, savingPrefix: string){
        super(savingPrefix);
        
        this.game = game;
    }
    
    // Public setters
    public setCurrent(n: number, reCalcPlayerMaxHp: boolean = false): void{ // We update the status bar every time our current value changes
        super.setCurrent(n);
        
        if(reCalcPlayerMaxHp) this.game.getPlayer().reCalcMaxHp();
        else this.game.updateStatusBar();
    }
}
