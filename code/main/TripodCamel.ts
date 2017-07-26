///<reference path="QuestEntity.ts"/>

class TripodCamel extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A tripod camel", "a tripod camel"),
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
        if(Random.flipACoin())
            this.getRenderArea().drawArray(Database.getAscii("places/quests/desert/tripodCamel1"));
        else
            this.getRenderArea().drawArray(Database.getAscii("places/quests/desert/tripodCamel2"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its long neck", "its long neck"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, 0), new Pos(3, 3))), 5));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setBetweenDelay(6, 8);
    }
    
    // Public methods
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(20 + Random.upTo(12)), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
}