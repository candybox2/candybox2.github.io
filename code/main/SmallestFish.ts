///<reference path="QuestEntity.ts"/>

class SmallestFish extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A very small fish", "a very small fish"),
              new RenderArea(3, 1),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(3, 1))),
              new QuestEntityMovement(new Pos(-1, 0))
             );
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(10);
        this.setHp(10);
        
        // Set the ascii art
        this.getRenderArea().drawArray(Database.getAscii("places/quests/theSea/smallestFish"));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its fins", "its fins"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(5, 2))), 1));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(6);
    }
}