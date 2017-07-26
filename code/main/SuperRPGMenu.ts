class SuperRPGMenu{
    // The SuperRPG
    private superRPG: SuperRPG;
    
    // The ascii art we need to display on the left (name of the ascii in the database)
    private asciiName: string;
    
    // Menu entries
    private entries: SuperRPGMenuEntry[] = [];
    
    // Index of the currently selected entry
    private currentlySelectedEntryIndex: number;
    
    // Constructor
    constructor(superRPG: SuperRPG, asciiName: string, currentlySelectedEntryIndex: number){
        // Set from parameters
        this.superRPG = superRPG;
        this.asciiName = asciiName;
        this.currentlySelectedEntryIndex = currentlySelectedEntryIndex;
    }
    
    // Public methods
    public addEntry(entry: SuperRPGMenuEntry): void{
        this.entries.push(entry);
    }
    
    public draw(renderArea: RenderArea): void{
        // Draw the separating line
        renderArea.drawVerticalLine("|", 26, 3, 11);
        
        // Draw the ascii art on the left
        renderArea.drawArray(Database.getAscii(this.asciiName), 0 + Math.floor((26-Database.getAsciiWidth(this.asciiName))/2), 2 + Math.floor((10-Database.getAsciiHeight(this.asciiName))/2));
    
        // Draw the entries
        for(var i = 0; i < this.entries.length; i++){
            this.entries[i].draw(renderArea, 27, 3+Math.floor((10-(this.entries.length*2))/2)+i*2, (this.currentlySelectedEntryIndex == i), 26);
        }
    }
    
    public pressedDownButton(): void{
        this.currentlySelectedEntryIndex += 1;
        if(this.currentlySelectedEntryIndex >= this.entries.length)
            this.currentlySelectedEntryIndex = this.entries.length-1;
    }
    
    public pressedSpaceButton(): void{
        this.entries[this.currentlySelectedEntryIndex].getCallbackCollection().fire();
    }
    
    public pressedUpButton(): void{
        this.currentlySelectedEntryIndex -= 1;
        if(this.currentlySelectedEntryIndex < 0)
            this.currentlySelectedEntryIndex = 0;
    }
    
    // Public getters
    public getSuperRPG(): SuperRPG{
        return this.superRPG;
    }
    
    // Public setters
    public setAsciiName(asciiName: string): void{
        this.asciiName = asciiName;
    }
    
    public setEntries(...entries: SuperRPGMenuEntry[]): void{
        this.entries = entries;
    }
}