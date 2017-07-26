class LighthousePuzzle{
    // Array of parts
    private parts: LighthousePuzzlePart[][]; // 7*5
    
    // Constructor
    constructor(lighthouse: Lighthouse){
        // Create the parts
        this.createParts(lighthouse);
    }
    
    // Public methods
    public draw(renderArea: RenderArea, pos: Pos): void{
        for(var i = 0; i < 7; i++){
            for(var j = 4; j >= 0; j--){
                if(this.parts[i][j] != null)
                    this.parts[i][j].draw(renderArea, pos.plus(new Pos(i*7, j*4)));
            }
        }
    }
    
    // Public getters
    public getParts(): LighthousePuzzlePart[][]{
        return this.parts;
    }
    
    // Private methods
    private createParts(lighthouse: Lighthouse): void{
        this.parts = [];
        
        // Add the arrays inside the arrays, and set each part to null
        for(var i = 0; i < 7; i++){
            this.parts[i] = [];
            for(var j = 0; j < 5; j++){
                this.parts[i][j] = null;
            }
        }
        
        // Add the central part, the first shown at first
        // It will allow use to show up to three other parts around
        this.parts[3][2] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_AROUND, 3, new Pos(3, 2), true);
        
        // Add the show right, show below move below to the right and show above parts
        this.parts[3][1] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_RIGHT, 1, new Pos(3, 1), false); // above the central part
        this.parts[4][1] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_BELOW, 1, new Pos(4, 1), false); // top right corner of the central part
        this.parts[4][2] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.MOVE_BELOW_LINE_TO_THE_RIGHT, 5, new Pos(4, 2), false); // on the right of the central part
        this.parts[3][3] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(3, 3), false); // below the central part
        
        // Add the lives part
        this.parts[5][2] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.LIVES, 1, new Pos(5, 2), false);
        
        // Add the show below
        this.parts[4][3] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_BELOW, 1, new Pos(4, 3), false);
        
        // Add the cool path
        this.parts[3][4] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_LEFT_RIGHT, 2, new Pos(3, 4), false);
        this.parts[4][4] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_RIGHT, 1, new Pos(4, 4), false);
        this.parts[5][4] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_RIGHT, 1, new Pos(5, 4), false);
        this.parts[6][4] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(6, 4), false);
        
        this.parts[0][3] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(0, 3), false);
        this.parts[6][2] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(6, 2), false);
        this.parts[6][1] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_LEFT, 1, new Pos(6, 1), false);
        
        // Add the lives part at the end of the cool path
        this.parts[5][1] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.LIVES, 1, new Pos(5, 1), false);
        
        // Add the path to the second move below line to the right
        this.parts[2][4] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_LEFT, 1, new Pos(2, 4), false);
        this.parts[1][4] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_LEFT, 1, new Pos(1, 4), false);
        this.parts[0][4] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.MOVE_BELOW_LINE_TO_THE_RIGHT, 0, new Pos(0, 4), false);
        
        // And the end (9 parts allowing us to give life to the ? ?)
        this.parts[0][0] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_RIGHT, 1, new Pos(0, 0), false);
        this.parts[0][1] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(0, 1), false);
        this.parts[0][2] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(0, 2), false);
        
        this.parts[1][0] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.LIVES, 0, new Pos(1, 0), false);
        this.parts[1][1] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.MOVE_LEFT_LINE_ABOVE, 0, new Pos(1, 1), false);
        this.parts[1][2] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(1, 2), false);
        
        this.parts[2][0] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.LIVES, 1, new Pos(2, 0), false);
        this.parts[2][1] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(2, 1), false);
        this.parts[2][2] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_ABOVE, 1, new Pos(2, 2), false);
        
        // Add three useless parts to fill the blanks
        this.parts[3][0] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_LEFT, 1, new Pos(3, 0), false);
        this.parts[4][0] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.BLANK, 0, new Pos(4, 0), false);
        this.parts[5][0] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_BELOW, 1, new Pos(5, 0), false);
        this.parts[6][0] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.WHAT, 0, new Pos(6, 0), true);
        
        // Add some more useless parts to fill the blanks
        this.parts[1][3] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.BLANK, 0, new Pos(1, 3), false);
        this.parts[2][3] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.NOTHING_HERE, 0, new Pos(2, 3), false);
        this.parts[5][3] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.SHOW_LEFT, 1, new Pos(5, 3), false);
        this.parts[6][3] = new LighthousePuzzlePart(lighthouse, LighthousePuzzlePartType.BLANK, 0, new Pos(6, 3), false);
    }
}