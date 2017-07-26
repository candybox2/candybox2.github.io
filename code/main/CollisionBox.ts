class CollisionBox{
    // The quest entity
    private questEntity: QuestEntity;
    
    // Position
    private position: Pos;
    
    // Size
    private size: Pos;
    
    // Constructor
    constructor(questEntity: QuestEntity, position: Pos, size: Pos){
        this.questEntity = questEntity;
        this.position = position;
        this.size = size;
    }
    
    // Public methods
    public collidesWith(collisionBox: CollisionBox, pos: Pos = new Pos(0, 0)): boolean{
        // We return false if we detect that the collision is impossible
        if(collisionBox.questEntity.getGlobalPosition().x + collisionBox.position.x + collisionBox.size.x <= this.questEntity.getGlobalPosition().x + this.position.plus(pos).x)
            return false;
        if(collisionBox.questEntity.getGlobalPosition().x + collisionBox.position.x >= this.questEntity.getGlobalPosition().x + this.position.plus(pos).x + this.size.x)
            return false;
        if(collisionBox.questEntity.getGlobalPosition().y + collisionBox.position.y + collisionBox.size.y <= this.questEntity.getGlobalPosition().y + this.position.plus(pos).y)
            return false;
        if(collisionBox.questEntity.getGlobalPosition().y + collisionBox.position.y >= this.questEntity.getGlobalPosition().y + this.position.plus(pos).y + this.size.y)
            return false;
        
        // Else, we return true
        return true;
    }
    
    public move(pos: Pos): void{
        this.position.add(pos);
    }
    
    // Public getters
    public getPosition(): Pos{
        return this.position;
    }
    
    public getSize(): Pos{
        return this.size;
    }
}
