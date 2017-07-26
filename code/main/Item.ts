class Item{
    // Item name used for saving
    private savingName: string;
    
    // Item name as found in the text database
    private databaseName: string;
    
    // Description name as found in the text database
    private databaseDescriptionName: string;
    
    // Ascii
    private ascii: string;
    
    // Constructor
    constructor(savingName: string, databaseName: string, databaseDescriptionName: string, ascii: string){
        // We set the variables
        this.savingName = savingName;
        this.databaseName = databaseName;
        this.databaseDescriptionName = databaseDescriptionName;
        this.ascii = ascii;
    
        // We register the savingName
        Saving.registerBool(this.savingName, false);
    }
    
    // Public methods
    public foundCandies(player: Player, quest: Quest, howMany: number): number{
        return howMany;
    }
    
    public hit(player: Player, quest: Quest, questEntity: QuestEntity, damage: number, reason: QuestEntityDamageReason): number{
        return damage;
    }
    
    public inflictDamage(player: Player, quest: Quest, damage: number, reason: QuestEntityDamageReason): number{
        return damage;
    }
    
    public isPossessed(): boolean{
        return Saving.loadBool(this.savingName);
    }
    
    // Public getters
    public getAscii(): string{
        return this.ascii;
    }
    
    public getDatabaseDescriptionName(): string{
        return this.databaseDescriptionName;
    }
    
    public getDatabaseName(): string{
        return this.databaseName;
    }
    
    public getSavingName(): string{
        return this.savingName;
    }
    
    public getSpecialAbility(): string{
        return null;
    }
}
