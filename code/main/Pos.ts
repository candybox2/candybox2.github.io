class Pos{
    // x y
    public x: number;
    public y: number;
    
    // Constructor
    constructor(x: number = 0, y: number = 0){
        this.x = x;
        this.y = y;
    }
    
    // Public methods
    public add(pos: Pos): void{
        this.x += pos.x;
        this.y += pos.y;
    }
    
    public copy(): Pos{
        return new Pos(this.x, this.y);
    }
    
    public getDistance(pos: Pos): Pos{
        return new Pos(this.x-pos.x, this.y-pos.y);
    }
    
    public invert(): void{
        var temp: number = this.x;
        this.x = this.y;
        this.y = temp;
    }
    
    public multiply(pos: Pos): Pos{
        this.x = this.x * pos.x;
        this.y = this.y * pos.y;
        return this;
    }
    
    public plus(pos: Pos): Pos{ // The plus method return a new Pos object containing our position with the position given in parameter added
        return new Pos(this.x + pos.x, this.y + pos.y);
    }
}