///<reference path="CandiesThrownSmiley.ts"/>

class CandiesThrownSmileyFirstLine extends CandiesThrownSmiley{
    // The line
    private line: string;
    
    // Constructor
    constructor(line: string){
        super();
        this.line = line;
    }
    
    // draw()
    public draw(renderArea: RenderArea, x: number, y: number, base: string): number{
        renderArea.drawString(base + this.line, x, y);
        return 0;
    }
}