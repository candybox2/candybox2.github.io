///<reference path="QuestEntity.ts"/>

class Seahorse extends QuestEntity{
    // Intended x position
    private intendedXPosition: number;
    
    // Constructor
    constructor(quest: Quest, pos: Pos, intendedXPosition: number){
        super(quest,
              pos,
              new Naming("A magical seahorse", "a magical seahorse"),
              new RenderArea(4, 4),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(3, 1)),
                                         new CollisionBox(this, new Pos(1, 1), new Pos(3, 1)),
                                         new CollisionBox(this, new Pos(2, 2), new Pos(1, 1)),
                                         new CollisionBox(this, new Pos(2, 3), new Pos(1, 1))
                                        ),
              new QuestEntityMovement(new Pos(-1, 0))
             );
        
        // Set the intended x position
        this.intendedXPosition = intendedXPosition;
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(20);
        this.setHp(20);
        
        // Set the ascii art
        this.getRenderArea().drawArray(Database.getAscii("places/quests/theSea/seahorse"));
        
        // Set the transparency
        this.setTransparency(new RenderTransparency(" "));
        
        // Add a spell caster
        this.addQuestEntitySpellCaster(new QuestEntitySpellCaster(new CallbackCollection(this.castWaterBall.bind(this))));
        this.getLastQuestEntitySpellCaster().getDelay().setFixedDelay(30, Random.upTo(30));
    }
    
    // Public methods
    public tryToGoToIntendedXPosition(baseX: number): void{
        this.goTowards(this.getGlobalPosition(), new Pos(baseX + this.intendedXPosition, this.getGlobalPosition().y), 0, new Pos(1, 0));
    }
    
    // Private methods
    private castWaterBall(): void{
        // Create the waterBall
        var waterBall: Fireball = new Fireball(this.getQuest(),
                                               this.getGlobalPosition().plus(new Pos(-2, 0)),
                                               new Naming("A magical water ball", "a magical water ball"),
                                               new Color(ColorType.SEAHORSE_WATER_BALL),
                                               new Pos(2, 1),
                                               70,
                                               this.getAndPossiblyCreateSpellCastingDamageReason(new Naming("A magical water ball", "a magical water ball"))
                                            );
        
        // No target
        waterBall.setTargetTypeNoTarget(new Pos(-2, 0));
        
        // Add the entity
        this.getQuest().addEntity(waterBall);
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(150), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
}