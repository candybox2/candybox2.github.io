class EnchantmentItem{
    // The game
    private game: Game;
    
    // The name in the saving database
    private savingName: string;
    
    // The type
    private type: EqItemType;
    
    // Constructor
    constructor(game: Game, savingName: string, type: EqItemType){
        this.game = game;
        this.savingName = savingName;
        this.type = type;
    }
    
    // Public methods
    public getText(): string{
        var text: string = Database.getText(this.game.getEqItemFromEqItemType(this.savingName, this.type).getDatabaseName());
        
        if(Database.isTranslated())
            text += " (" + Database.getTranslatedText(this.game.getEqItemFromEqItemType(this.savingName, this.type).getDatabaseName()) + ")";
        
        return text;
    }
    
    public isPossessed(): boolean{
        return Saving.loadBool(this.savingName);
    }
    
    public unequipIfEquipped(): void{
        this.game.unequipIfEquipped(this.savingName, this.type);
    }
    
    // Public getters
    public getSavingName(): string{
        return this.savingName;
    }
}