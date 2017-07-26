class QuestLog{
    // Array of messages contained in the quest log
    private messages: QuestLogMessage[] = [];
    
    // Constructor
    constructor(){

    }
    
    // Public method
    public addDelimiter(): void{
        this.messages.push(new QuestLogMessage("----------------------------------------------------------------------------------------------------"));
        this.messages.push(new QuestLogMessage(""));
    }
    
    public addMessage(message: QuestLogMessage): void{
        // We add the message
        this.messages.push(message);
        
        // We check the log size
        this.checkLogSize();
    }
    
    public draw(renderArea: RenderArea, pos: Pos): void{
        // We draw the lines
        renderArea.drawHorizontalLine("-", pos.x, pos.x+100, pos.y);
        renderArea.drawHorizontalLine("-", pos.x, pos.x+100, pos.y+11);
        
        // We draw the messages
        for(var i = 0; i < this.messages.length; i++){
            this.messages[i].draw(renderArea, new Pos(pos.x, 1 + pos.y + this.messages.length-1-i), 100);
        }
    }
    
    // Private methods
    private checkLogSize(): void{
        if(this.messages.length > 10){
            this.messages.splice(0, this.messages.length - 10);
        }
    }
}