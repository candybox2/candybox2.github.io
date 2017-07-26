class PondLine{
    // Coordinates
    private x1: number;
    private x2: number;
    
    // Is the line currently used by a lolligator ?
    private isUsed: boolean = false;
    
    // Constructor
    constructor(x1: number, x2: number){
        this.x1 = x1;
        this.x2 = x2;
    }
    
    // Public getters
    public getIsUsed(): boolean{
        return this.isUsed;
    }
    
    public getX1(): number{
        return this.x1;
    }
    
    public getX2(): number{
        return this.x2;
    }
    
    // Public setters
    public setIsUsed(isUsed: boolean): void{
        this.isUsed = isUsed;
    }
}
