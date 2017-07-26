class QuestEntityHealthBar{
    // The quest entity
    private questEntity: QuestEntity;
    
    // Our position & position type
    private position: Pos;
    private positionType: QuestEntityHealthBarPositionType;
    
    // The bar !
    private barSize: Pos;
    private bar: Bar;
    
    // Should we draw the bar even if the health is full ?
    private drawEvenIfFull: boolean;
    private shouldBeDrawn: boolean;
    
    // Should we add some text ?
    private showText: boolean;
    
    // Constructor
    constructor(questEntity: QuestEntity,
                barSize: Pos,
                position: Pos = new Pos(0, -1), // By default, the bar will be above the entity
                positionType: QuestEntityHealthBarPositionType = QuestEntityHealthBarPositionType.RELATIVE,
                drawEvenIfFull: boolean = false,
                showText: boolean = false,
                barType: BarType = BarType.UNICOLOR_HEALTH
               ){
        // Create the bar
        this.bar = new Bar(barType);
        
        // Set the parameters
        this.setBarSize(barSize);
        this.questEntity = questEntity;
        this.position = position;
        this.positionType = positionType;
        this.drawEvenIfFull = drawEvenIfFull;
        this.showText = showText;
        
        // Update for the first time
        this.update();
    }
    
    // Public methods
    public draw(renderArea: RenderArea): void{
        // Draw if we should be drawn
        if(this.shouldBeDrawn){
            switch(this.positionType){
                case QuestEntityHealthBarPositionType.FIXED_ON_PAGE:
                    renderArea.drawArea(this.bar, ((this.questEntity.getQuest().getRenderArea().getWidth()-100) - this.questEntity.getQuest().getGap())/2 + this.questEntity.getQuest().getRealQuestPosition().x + this.position.x + this.questEntity.getQuest().getGlobalDrawingOffset().x, this.questEntity.getQuest().getRealQuestPosition().y + this.position.y + this.questEntity.getQuest().getGlobalDrawingOffset().y, new RenderTransparency(" "));
                break;
                case QuestEntityHealthBarPositionType.FIXED:
                    renderArea.drawArea(this.bar, this.questEntity.getQuest().getRealQuestPosition().x + this.position.x + this.questEntity.getQuest().getGlobalDrawingOffset().x, this.questEntity.getQuest().getRealQuestPosition().y + this.position.y + this.questEntity.getQuest().getGlobalDrawingOffset().y, new RenderTransparency(" "));
                break;
                case QuestEntityHealthBarPositionType.RELATIVE:
                    if(this.questEntity.getQuest().getRealQuestPosition().x + this.questEntity.getGlobalPosition().x + this.position.x > 0 && // If the bar fit at the left
                       this.questEntity.getQuest().getRealQuestPosition().x + this.questEntity.getGlobalPosition().x + this.position.x + this.bar.getWidth() <= renderArea.getWidth() && // And at the right too
                       this.questEntity.getGlobalPosition().y + this.position.y > 0 && // And at the top
                       this.questEntity.getGlobalPosition().y + this.position.y <= this.questEntity.getQuest().getRealQuestSize().y // And at the bottom
                    ){
                        renderArea.drawArea(this.bar, this.questEntity.getQuest().getRealQuestPosition().x + this.questEntity.getGlobalPosition().x + this.position.x + this.questEntity.getQuest().getGlobalDrawingOffset().x, this.questEntity.getQuest().getRealQuestPosition().y + this.questEntity.getGlobalPosition().y + this.position.y + this.questEntity.getQuest().getGlobalDrawingOffset().y, new RenderTransparency(" "));
                    }
                break;
            }
        }
    }
    
    public update(): void{
        // If we should draw the bar even if full or it isn't full, then we set that we should draw it
        if(this.drawEvenIfFull || this.questEntity.getHp()/this.questEntity.getMaxHp() != 1){
            this.shouldBeDrawn = true;
        }
        else this.shouldBeDrawn = false;
        
        // Update the bar only if it should be draw
        if(this.shouldBeDrawn){
            // If we don't have to show text
            if(this.showText == false)
                this.bar.update(this.questEntity.getHp()/this.questEntity.getMaxHp(), this.questEntity.getHp().toString());
            // If we have to
            else
                this.bar.update(this.questEntity.getHp()/this.questEntity.getMaxHp(), this.questEntity.getNaming().getBeginning() + " : " + this.questEntity.getHp().toString() + "/" + this.questEntity.getMaxHp().toString());
        }
    }
    
    // Public setters
    public setBarSize(barSize: Pos): void{
        this.barSize = barSize;
        this.bar.resize(this.barSize.x, this.barSize.y);
    }
    
    public setDrawEvenIfFull(value: boolean): void{
        this.drawEvenIfFull = value;
    }
}
