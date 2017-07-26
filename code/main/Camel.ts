///<reference path="QuestEntity.ts"/>

class Camel extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A camel", "a camel"),
              new RenderArea(7, 2),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(6, 1)), new CollisionBox(this, new Pos(2, 1), new Pos(5, 1))),
              new QuestEntityMovement()
             );
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(7);
        this.setHp(7);
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawArray(Database.getAscii("places/quests/desert/camel"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its long neck", "its long neck"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, 0), new Pos(3, 3))), 5));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setBetweenDelay(5, 7);
    }
    
    // Public methods
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(5 + Random.upTo(5)), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
}