class InsideYourBoxSweet{
    // The ascii art name
    private asciiArt: string;
    
    // The position
    private pos: Pos;
    
    // The speed
    private speed: number;
    
    // Constructor
    constructor(){
        // Set the ascii art name
        this.asciiArt = "general/insideYourBox/" + Random.between(0, 10);
        
        // Set the position
        this.pos = new Pos(-Database.getAsciiWidth(this.asciiArt) + Random.between(0, 99 + Database.getAsciiWidth(this.asciiArt)), -Database.getAsciiHeight(this.asciiArt));
        
        // Set the speed
        this.speed = Random.between(1, 3);
    }

    // Public methods
    public draw(renderArea: RenderArea): void{
        // Draw the ascii art at the right position
        renderArea.drawArray(Database.getAscii(this.asciiArt), this.pos.x, this.pos.y);
    }

    public update(): boolean{
        // If we're out of the screen, we return true
        if(this.pos.y >= 40)
            return true;
        
        // Increase the speed
        this.speed += 0.3;
        
        // Increase the position
        this.pos.y += Math.floor(this.speed);
    }
}