///<reference path="QuestEntity.ts"/>

class Rat extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A rat", "a rat"),
              new RenderArea(3, 1),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(3, 1))),
              new QuestEntityMovement()
             );
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(3);
        this.setHp(3);
        
        // Set the ascii art
        this.getRenderArea().drawArray(Database.getAscii("places/quests/cellar/rat"));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its teeth", "its teeth"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(5, 2))), 1));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(3);
    }
    
    // Public methods
    public willDie(): void{
        // We find a candy
        if(Random.oneChanceOutOf(3))
            this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(1), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        // We don't find a candy
        else
            this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage()));
    }
}