///<reference path="QuestEntity.ts"/>

class Wall extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A wall", "a wall"),
              null,
              new Pos(0, 0),
              new CollisionBoxCollection()
             );
    }
    
    // Public method
    public addBox(pos: Pos, size: Pos): void{
        this.getCbc().addCollisionBox(new CollisionBox(this, pos, size));
    }
    
    public removeBoxes(): void{
        this.getCbc().removeBoxes();
    }
}