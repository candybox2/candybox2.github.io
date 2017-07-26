class RenderTag{
    private tagString: string;
    private x: number;
    
    // Constructor
    constructor(x: number, tagString: string){
        this.x = x;
        this.tagString = tagString;
    }
    
    // Public methods
    public clone(): RenderTag{
        return new RenderTag(this.x, this.tagString);
    }
    
    public draw(str: string): string{
        return str.addAt(this.x, this.tagString);
    }
    
        
    // Public getters
    public getString(): string{
        return this.tagString;
    }
    
    public getX(): number{
        return this.x;
    }
    
    // Public setters
    public setX(x: number): RenderTag{
        this.x = x;
        return this;
    }
}