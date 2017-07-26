///<reference path="Item.ts"/>

class GridItem extends Item{
    // Position in the item grid
    private position: Pos;
    
    // Constructor
    constructor(savingName: string, databaseName: string, databaseDescriptionName: string, ascii: string, position: Pos){
        super(savingName, databaseName, databaseDescriptionName, ascii);
        
        this.position = position;
    }
    
    // Public methods
    public update(player: Player, quest: Quest): void{
        
    }
    
    // Public getters
    public getPosition(): Pos{
        return this.position;
    }
}