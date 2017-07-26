class TheSeaFloor{
    // The type
    private type: TheSeaFloorType;
    
    // Height
    private height: number;
    
    // Counters
    private howManyFloorsOfTheSameTypeBefore: number;
    
    // Does this floor have a plant on it ?
    private hasAPlant: boolean = false;
    
    // Special character on the floor
    private hasSpecialCharacter: boolean;
    private specialCharacterHeight: number;
    private specialCharacter: string;
    
    // Constructor
    constructor(type: TheSeaFloorType, height: number, previousFloor: TheSeaFloor = null){
        this.type = type;
        this.height = height;
        
        // If the previous floor is null or has a different type
        if(previousFloor == null || previousFloor.getType() != this.type){
            // There's no floor of the same type before
            this.howManyFloorsOfTheSameTypeBefore = 0;
        }
        else{
            // We take the howManyFloorsOfTheSameTypeBefore of the previous floor and we add one
            this.howManyFloorsOfTheSameTypeBefore = previousFloor.howManyFloorsOfTheSameTypeBefore + 1;
        }
        
        // Special character stuff
        if(Random.oneChanceOutOf(3) && (previousFloor == null || previousFloor.getHasSpecialCharacter() == false)){
            // We will have a special character
            this.hasSpecialCharacter = true;
            // Set the height
            this.specialCharacterHeight = Random.between(0, this.height-1);
            // Set the character
            if(Random.oneChanceOutOf(4)){
                this.specialCharacter = "^";
            }
            else{
                this.specialCharacter = "-";
            }
        }
        else{
            // We won't have a special character
            this.hasSpecialCharacter = false;
        }
    }
    
    // Public methods
    public draw(renderArea: RenderArea, floorPosition: number, xPosition: number): void{
        // We can draw different characters for the floor, depending on the type
        switch(this.type){
            case TheSeaFloorType.NORMAL:
                renderArea.drawString("_", xPosition, floorPosition - this.height);
            break;
            case TheSeaFloorType.GOING_DOWN:
                renderArea.drawString("\\", xPosition, floorPosition - this.height);
            break;
            case TheSeaFloorType.GOING_UP:
                renderArea.drawString("/", xPosition, floorPosition - this.height);
            break;
        }
        
        // If we have a special character
        if(this.hasSpecialCharacter){
            // We draw it
            renderArea.drawString(this.specialCharacter, xPosition, floorPosition - this.specialCharacterHeight);
        }
    }
    
    // Pubic getters
    public getHasAPlant(): boolean{
        return this.hasAPlant;
    }
    
    public getHasSpecialCharacter(): boolean{
        return this.hasSpecialCharacter;
    }
    
    public getHeight(): number{
        return this.height;
    }
    
    public getHowManyFloorsOfTheSameTypeBefore(): number{
        return this.howManyFloorsOfTheSameTypeBefore;
    }
    
    public getType(): TheSeaFloorType{
        return this.type;
    }
    
    // Public setters
    public setHasAPlant(hasAPlant: boolean): void{
        this.hasAPlant = hasAPlant;
    }
}
