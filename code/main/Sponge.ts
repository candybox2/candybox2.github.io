///<reference path="QuestEntity.ts"/>

class Sponge extends QuestEntity{
    // Constructor
    constructor(quest: Quest, leftDownCornerPosition: Pos){
        // Create the real global position
        var globalPosition: Pos = leftDownCornerPosition;
        globalPosition.add(new Pos(0, -Database.getAsciiHeight("places/quests/theSea/sponge")+1));
        
        // Call the mother constructor
        super(quest,
              globalPosition,
              new Naming("A sponge", "a sponge"),
              new RenderArea(),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(6, 3)))
             );
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(40);
        this.setHp(40);
        
        // Set the team (nature)
        this.setTeam(QuestEntityTeam.NATURE);
        
        // Draw the ascii art
        this.getRenderArea().resizeFromArray(Database.getAscii("places/quests/theSea/sponge"));
        this.getRenderArea().drawArray(Database.getAscii("places/quests/theSea/sponge"));
    }
    
    // willDie()
    public willDie(): void{
       super.willDie();
       this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "gridItemPossessedSponge", "You found a sponge.", "You gain a sponge."));
    }
}