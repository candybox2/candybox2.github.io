///<reference path="QuestEntity.ts"/>

class SeaSnake extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A sea snake", "a sea snake"),
              new RenderArea(78, 11),
              new Pos(0, 0)
             );
        
        // Set the movement and the animation
        this.setQuestEntityMovement(new QuestEntityMovement(new Pos(-Random.between(3, 5), 0)));
        this.setQuestEntityAnimation(new QuestEntityAnimation(0, 0, Random.upTo(11), "places/quests/theSea/seaSnake/1",
                                                                                     "places/quests/theSea/seaSnake/2",
                                                                                     "places/quests/theSea/seaSnake/3",
                                                                                     "places/quests/theSea/seaSnake/4",
                                                                                     "places/quests/theSea/seaSnake/5",
                                                                                     "places/quests/theSea/seaSnake/6",
                                                                                     "places/quests/theSea/seaSnake/7",
                                                                                     "places/quests/theSea/seaSnake/8",
                                                                                     "places/quests/theSea/seaSnake/9",
                                                                                     "places/quests/theSea/seaSnake/10",
                                                                                     "places/quests/theSea/seaSnake/11",
                                                                                     "places/quests/theSea/seaSnake/12"));
        
        // Set the transparency
        this.setTransparency(new RenderTransparency(" ", "%"));
        
        // Set destructible
        this.setDestructible(false);
    }
    
    // update()
    public update(): void{
        // Launch a magic ball! (2 chances out of 3 to launch one)
        if(Random.oneChanceOutOf(3) == false) this.castWaterBall();
        
        // Call the mother class update method
        super.update();
    }
    
    // Private methods
    private castWaterBall(): void{
        // Create the waterBall
        var waterBall: Fireball = new Fireball(this.getQuest(),
                                               this.getGlobalPosition().plus(new Pos(-2, this.getYCastingOffset())),
                                               new Naming("A magical water ball", "a magical water ball"),
                                               new Color(ColorType.SEAHORSE_WATER_BALL),
                                               new Pos(2, 1),
                                               300,
                                               this.getAndPossiblyCreateSpellCastingDamageReason(new Naming("A magical water ball", "a magical water ball"))
                                            );
        
        // No target
        waterBall.setTargetTypeNoTarget(new Pos(-Random.between(2, 4), Random.fromArray([-1, 0, 1])));
        
        // Add the entity
        this.getQuest().addEntity(waterBall);
    }
    
    private getYCastingOffset(): number{
        switch(this.getQuestEntityAnimation().getCurrentAsciiIndex()){
            case 0: return 4; break;
            case 1: return 5; break;
            case 2: return 6; break;
            case 3: return 7; break;
            case 4: return 8; break;
            case 5: return 9; break;
            case 6: return 10; break;
            case 7: return 9; break;
            case 8: return 8; break;
            case 9: return 7; break;
            case 10: return 6; break;
            case 11: return 5; break;
        }
    }
}
