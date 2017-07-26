///<reference path="QuestEntity.ts"/>

class JellyFish extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A jellyfish", "a jellyfish"),
              new RenderArea(6, 5),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 1), new Pos(6, 1)),
                                         new CollisionBox(this, new Pos(1, 2), new Pos(4, 1)),
                                         new CollisionBox(this, new Pos(0, 3), new Pos(4, 1)),
                                         new CollisionBox(this, new Pos(1, 4), new Pos(4, 1))
                                        ),
              new QuestEntityMovement(new Pos(-1, 0))
             );
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(42);
        this.setHp(42);
        
        // Set the ascii art
        this.getRenderArea().drawArray(Database.getAscii("places/quests/theSea/jellyFish"));
        
        // Set the transparency
        this.setTransparency(new RenderTransparency(" ", "%"));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Poisoned tentacles", "poisoned tentacles"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(8, 7))), 2));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(0);
    }
    
    // Public methods
    public update(): void{
        // We follow the player
        this.goTowards(this.getRenderAreaCenter(), this.getQuest().getGame().getPlayer().getRenderAreaCenter(), 3);
        
        // We call the mother update method
        super.update();
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(120), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
}