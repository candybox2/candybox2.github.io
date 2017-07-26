class QuestEntitySpellColor{
    // The quest
    private quest: Quest;
    
    // Position and size
    private position: Pos;
    private size: Pos;
    
    // The color
    private color: Color;
    
    // Constructor
    constructor(quest: Quest, position: Pos, size: Pos, color: Color){
        this.quest = quest;
        this.position = position;
        this.size = size;
        this.color = color;
    }
    
    // Public methods
    public draw(renderArea: RenderArea, areaPosition: Pos): void{
        var x1: number;
        var x2: number;
        var y: number;
        
        for(var i = 0; i < this.size.y; i++){
            // x1
            x1 = this.position.x + areaPosition.x;
            if(x1 < this.quest.getRealQuestPosition().x) x1 = this.quest.getRealQuestPosition().x;
            // x2
            x2 = this.position.x + areaPosition.x + this.size.x;
            if(x2 > this.quest.getRealQuestPosition().x + this.quest.getRealQuestSize().x) x2 = this.quest.getRealQuestPosition().x + this.quest.getRealQuestSize().x;
            // y
            y = this.position.y + areaPosition.y + i;
            
            if(x1 < x2 && y >= this.quest.getRealQuestPosition().y && y < this.quest.getRealQuestPosition().y + this.quest.getRealQuestSize().y){
                renderArea.addBackgroundColor(x1, x2, y, this.color);
            }
        }
    }
}