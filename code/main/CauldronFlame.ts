class CauldronFlame{
    // Position
    private pos: Pos;
    
    // Character
    private character: string;
    
    // Constructor
    constructor(pos: Pos, character: string){
        this.pos = pos;
        this.character = character;
    }
    
    // Public methods
    public draw(renderArea: RenderArea, x: number, y: number): void{
        renderArea.drawString(this.character, x + this.pos.x, y + this.pos.y);
    }
}