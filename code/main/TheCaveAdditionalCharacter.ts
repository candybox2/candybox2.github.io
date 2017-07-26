class TheCaveAdditionalCharacter{
    // The cave
    private theCave: TheCave;
    
    // The character string
    private characterString: string;
    
    // The character position
    private characterPosition: Pos;
    
    // Constructor
    constructor(theCave: TheCave, characterString: string = null, characterPosition: Pos = null){
        // We set the cave
        this.theCave = theCave;
        
        // If the string given in parameter isn't null
        if(characterString != null){
            // We set our string from this one
            this.characterString = characterString;
        }
        // Else, if it's null
        else{
            // We choose a string randomly from the possible strings
            this.characterString = this.theCave.getAdditionalCharactersPossible()[Random.upTo(this.theCave.getAdditionalCharactersPossible().length-1)];
        }
        
        // If the position given in parameters isn't null
        if(characterPosition != null){
            // We set our position from this one
            this.characterPosition = characterPosition;
        }
        // Else, if it's null
        else{
            // We choose a position randomly from the possible positions
            this.characterPosition = this.theCave.getAdditionalCharactersPositionsPossible()[Random.upTo(this.theCave.getAdditionalCharactersPositionsPossible().length-1)];
        }
    }
    
    // Public getters
    public getPosition(): Pos{
        return this.characterPosition;
    }
    
    public getString(): string{
        return this.characterString;
    }
}
    