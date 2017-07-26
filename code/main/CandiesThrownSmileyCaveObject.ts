class CandiesThrownSmileyCaveObject{
    // The string
    private str: string;
    
    // The position
    private position: Pos;
    
    // Constructor
    constructor(str: string, position: Pos){
        this.str = str;
        this.position = position;
    }
    
    // Public getters
    public getPosition(): Pos{
        return this.position;
    }
    
    public getStr(): string{
        return this.str;
    }
}