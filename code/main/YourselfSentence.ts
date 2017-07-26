class YourselfSentence{
    // The text
    private text: string;
    
    // Are we going right or left?
    private isGoingRight: boolean;
    
    // Our position
    private position: Pos;
    
    // The quest
    private quest: Quest;
    
    // Constructor
    constructor(quest: Quest, text: string, isGoingRight: boolean, y: number){
        // Set from parameters
        this.quest = quest;
        this.text = text;
        this.isGoingRight = isGoingRight;
        
        // Set the position
        if(this.isGoingRight)
            this.position = new Pos(-this.text.length, y);
        else
            this.position = new Pos(100, y);
    }
    
    // Public methods
    public draw(renderArea: RenderArea): void{
        renderArea.drawString(this.text, this.quest.getRealQuestPosition().x + this.quest.getGlobalDrawingOffset().x + this.position.x, this.quest.getRealQuestPosition().y + this.quest.getGlobalDrawingOffset().y + this.position.y);
    }
    
    public update(): boolean{
        if(this.isGoingRight){
            this.position.x += 1;
            if(this.position.x > 100) // Out of the screen?
                return true; // Delete the sentence
        }
        else{
            this.position.x -= 1;
            if(this.position.x < -this.text.length) // Out of the screen?
                return true; // Delete the sentence
        }
        
        // We don't delete the sentence : we return false
        return false;
    }
}