class PondLolligator{
    // The pond lines array
    private pondLines: PondLine[];
    
    // Index of the pond line where the lolligator is in the pond lines array of the lollipops farm
    private pondLineIndex: number;
    
    // Orientation of the lolligator
    private isLeft: boolean;
    
    // Position in the pond line
    private x: number;
    
    // Is the lolligator fully visible or still in water ?
    private visibleType: PondLolligatorVisibleType;
    
    // Out width
    private width: number = 13;
    
    // Constructor
    constructor(pondLines: PondLine[], pondLineIndex: number){
        // Set from the parameters
        this.pondLines = pondLines;
        this.pondLineIndex = pondLineIndex;
        
        // Set the orientation (randomly)
        this.isLeft = Random.flipACoin();
        
        // Set the position (depending on the orientation)
        if(this.isLeft == false) // If the lolligator is looking right
            this.x = this.pondLines[this.pondLineIndex].getX1();
        else
            this.x = this.pondLines[this.pondLineIndex].getX2() - this.width;
        
        // At first, we're not fully visible
        this.visibleType = PondLolligatorVisibleType.NOT_FULLY_VISIBLE_YET;
        
        // Set isUsed for the pond lines we use
        this.setIsUsedForPondLines(true);
    }
    
    // Public methods
    public draw(renderArea: RenderArea, x: number, y: number): void{
        renderArea.drawArray(Database.getAscii("places/lollipopFarm/lolligator" + (this.isLeft? "Left":"Right") + (this.visibleType == PondLolligatorVisibleType.FULLY_VISIBLE? "Full":"Top")), x + this.x, y + this.pondLineIndex);
    }
    
    public move(): void{
        // If the lolligator is facing left, then it goes to the left
        if(this.isLeft){
            this.x -= 1;
            // If we're not fully visible but we should be
            if(this.visibleType == PondLolligatorVisibleType.NOT_FULLY_VISIBLE_YET && this.x + this.width < this.pondLines[this.pondLineIndex].getX2() - 2 && Random.oneChanceOutOf(5))
                this.visibleType = PondLolligatorVisibleType.FULLY_VISIBLE;
            else if(this.visibleType == PondLolligatorVisibleType.FULLY_VISIBLE && (this.x < this.pondLines[this.pondLineIndex].getX1() + 2 || Random.oneChanceOutOf(2)))
                this.visibleType = PondLolligatorVisibleType.NOT_FULLY_VISIBLE_ANYMORE;
        }
        // Else it goes to the right
        else{
            this.x += 1;
            // If we're not fully visible but we should be
            if(this.visibleType == PondLolligatorVisibleType.NOT_FULLY_VISIBLE_YET && this.x > this.pondLines[this.pondLineIndex].getX1() + 2 && Random.oneChanceOutOf(5))
                this.visibleType = PondLolligatorVisibleType.FULLY_VISIBLE;
            else if(this.visibleType == PondLolligatorVisibleType.FULLY_VISIBLE && (this.x + this.width > this.pondLines[this.pondLineIndex].getX2() - 2 || Random.oneChanceOutOf(2)))
                this.visibleType = PondLolligatorVisibleType.NOT_FULLY_VISIBLE_ANYMORE;
        }
    }
    
    // Called to know if the lolligator should be deleted or not
    public shouldBeDeleted(): boolean{
        // It depends on the orientation
        if(this.isLeft == false){
            // If we're too much on the right, return true
            if(this.x + this.width > this.pondLines[this.pondLineIndex].getX2())
                return true;
            return false;
        }
        else{
            // If we're too much on the left, return true
            if(this.x < this.pondLines[this.pondLineIndex].getX1())
                return true;
            return false;
        }
    }
    
    // Called just before the lolligator is deleted
    public willBeDeleted(): void{
        this.setIsUsedForPondLines(false);
    }
    
    // Private setters
    private setIsUsedForPondLines(isUsed: boolean): void{
        // Set for the line of the lolligator
        this.pondLines[this.pondLineIndex].setIsUsed(isUsed);
        
        // Set for the line above if there's a line above
        if(this.pondLineIndex > 0)
            this.pondLines[this.pondLineIndex-1].setIsUsed(isUsed);
    }
}
