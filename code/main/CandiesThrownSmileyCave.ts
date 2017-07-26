///<reference path="CandiesThrownSmiley.ts"/>

class CandiesThrownSmileyCave extends CandiesThrownSmiley{
    // The line
    private smiley: string;
    
    // Position of the smiley
    private smileyPosition: Pos;
    
    // Various objects (can be speeches, for example)
    private objects: CandiesThrownSmileyCaveObject[] = [];
    
    // Is the chest open ? (closed by default)
    private chestOpened: boolean = false;
    
    // The step
    private step: CandiesThrownSmileyCaveStep;
    
    // Constructor
    constructor(smiley: string, smileyPosition: Pos, step: CandiesThrownSmileyCaveStep = CandiesThrownSmileyCaveStep.FIRST_ROOM){
        super();
        this.smiley = smiley;
        this.smileyPosition = smileyPosition;
        this.step = step;
    }
    
    // draw()
    public draw(renderArea: RenderArea, x: number, y: number, base: string): number{
        // Draw the base
        renderArea.drawString(base, x, y);
        
        // Draw the cave's walls, depending on the step
        renderArea.drawVerticalLine("|", 0, y + 2, y + 8); // Left wall
        renderArea.drawVerticalLine("|", 62, y, y + 8); // Right wall
        renderArea.drawHorizontalLine("_", 0, 57, y + 1); // Roof
        renderArea.drawString("|", 56, y + 1); // Additional character
        switch(this.step){
            // Only third room
            case CandiesThrownSmileyCaveStep.THIRD_ROOM:
                renderArea.drawHorizontalLine("-", 12, 62, y + 16); // Floor
                renderArea.drawVerticalLine("|", 62, y + 9, y + 16); // Right wall
                renderArea.drawArray(Database.getAscii("general/candyRoom"), 12, y + 9); // Content of the room
            // Second & third room
            case CandiesThrownSmileyCaveStep.SECOND_ROOM:
                // Floor of the first room (we must make it in two pieces because there's a hole!)
                renderArea.drawHorizontalLine("-", 1, 4, y + 8); // Left
                renderArea.drawHorizontalLine("-", 9, 62, y + 8); // Right
                // Rest of the room
                renderArea.drawVerticalLine("|", 0, y + 9, y + 16); // Left wall
                renderArea.drawVerticalLine("|", 11, y + 9, y + 14); // Right wall
                renderArea.drawHorizontalLine("-", 1, 12, y + 16); // Floor
            break;
            // Only first room
            case CandiesThrownSmileyCaveStep.FIRST_ROOM:
                renderArea.drawHorizontalLine("-", 1, 62, y + 8); // Floor
            break;
        }
        
        // Draw the chest
        renderArea.drawString("|_|", 1, y + 7);
        if(this.chestOpened == false)
            renderArea.drawString("_", 2, y + 6);
        else
            renderArea.drawString("(", 1, y + 6);
        
        // Draw the smiley
        renderArea.drawString(this.smiley, x + this.smileyPosition.x, y + this.smileyPosition.y);
        
        // Draw objects
        for(var i = 0; i < this.objects.length; i++){
            renderArea.drawString(this.objects[i].getStr(), x + this.objects[i].getPosition().x, y + this.objects[i].getPosition().y);
        }
        
        // Return the cave's height
        switch(this.step){
            case CandiesThrownSmileyCaveStep.FIRST_ROOM:
                return 8;
            break;
            case CandiesThrownSmileyCaveStep.SECOND_ROOM:
            case CandiesThrownSmileyCaveStep.THIRD_ROOM:
                return 16;
            break;
        }
    }
    
    // Public methods used to add or change stuff (always return ourselves)
    public addObject(object: CandiesThrownSmileyCaveObject): CandiesThrownSmileyCave{
        this.objects.push(object);
        return this;
    }
    
    public openChest(): CandiesThrownSmileyCave{
        this.chestOpened = true;
        return this;
    }
}