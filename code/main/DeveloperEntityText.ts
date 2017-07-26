class DeveloperEntityText{
    // The damage dealth by the magic balls
    private damage: number;
    
    // The array of strings
    private text: string[];
    
    // X position on the strings
    private xPos: number;
    
    // The text base position
    private textPos: Pos;
    
    // The time the magic balls should live before going on the player
    private timeToLive: number;
    
    // Constructor
    constructor(damage: number, textPos: Pos, timeToLive: number, text: string[]){
        // Set from parameters
        this.damage = damage;
        this.text = text;
        this.textPos = textPos;
        this.timeToLive = timeToLive;
        
        // Set the default x position
        this.xPos = 0;
    }
    
    // Public methods
    public update(dev: DeveloperEntity): void{
        // Iterate over strings
        for(var i = 0; i < this.text.length; i++){
            // If there's a character at the current xPos of this string
            if(this.xPos < this.text[i].length && this.text[i][this.xPos] != " "){
                // Add a magic ball, depending on the character
                switch(this.text[i][this.xPos]){
                    case "B":
                        dev.addMagicBall(this.textPos.plus(new Pos(this.xPos, i)), this.damage, this.timeToLive - this.xPos, ColorType.DEVELOPER_BLUE);
                    break;
                    case "Y":
                        dev.addMagicBall(this.textPos.plus(new Pos(this.xPos, i)), this.damage, this.timeToLive - this.xPos, ColorType.DEVELOPER_YELLOW);
                    break;
                    case "O":
                        dev.addMagicBall(this.textPos.plus(new Pos(this.xPos, i)), this.damage, this.timeToLive - this.xPos, ColorType.DEVELOPER_ORANGE);
                    break;
                }
            }
        }
        
        // Increase xPos
        this.xPos += 1;
    }
}