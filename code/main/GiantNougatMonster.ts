///<reference path="QuestEntity.ts"/>

class GiantNougatMonster extends QuestEntity{
    // The step
    private step: GiantNougatMonsterStep;
    
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("The giant nougat monster", "the giant nougat monster"),
              new RenderArea(15, 4),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(1, 0), new Pos(12, 1)), new CollisionBox(this, new Pos(0, 1), new Pos(15, 2)), new CollisionBox(this, new Pos(1, 3), new Pos(12, 1))),
              new QuestEntityMovement()
             );
        
        // Set the default step
        this.step = GiantNougatMonsterStep.ASLEEP;
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(2000);
        this.setHp(2000);
        
        // Set the ascii art and the transparent character
        this.reDrawAscii();
        this.setTransparency(new RenderTransparency(" ", "%"));
    }
    
    // update()
    public update(): void{
        // Do something different depending on the current step
        switch(this.step){
            case GiantNougatMonsterStep.ASLEEP:
                // If we have less then 1577 hp (1577 was the number of bytes of the wikipedia article "Nougat" on the fifth of november, 2005 according to the article revision history. See here : https://en.wikipedia.org/w/index.php?title=Nougat&oldid=27465563)
                if(this.getHp() < 1577){
                    // We go to awake mode
                    this.step = GiantNougatMonsterStep.AWAKE;
                    this.reDrawAscii(); // Re draw the ascii art
                    this.addWeapon(); // Add the weapon
                }
            break;
            case GiantNougatMonsterStep.AWAKE:
                // If we have less than 500 hp
                if(this.getHp() < 500){
                    // We go to angry mode
                    this.step = GiantNougatMonsterStep.ANGRY;
                    this.reDrawAscii(); // Re draw the ascii art
                }
                // Go towards the player (speed : 1)
                this.goTowards(this.getGlobalPosition().plus(new Pos(6, 2)), this.getQuest().getGame().getPlayer().getGlobalPosition().plus(new Pos(1, 0)), 0, new Pos(1, 0));
            break;
            case GiantNougatMonsterStep.ANGRY:
                // Go towards the player (speed : 3)
                this.goTowards(this.getGlobalPosition().plus(new Pos(6, 2)), this.getQuest().getGame().getPlayer().getGlobalPosition().plus(new Pos(1, 0)), 0, new Pos(3, 0));
            break;
        }
        
        // Call the mother class update method
        super.update();
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(Random.upTo(123456)), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
    
    // Private methods
    private addWeapon(): void{
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Nougat", "nougat"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(17, 6))), 3000));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setBetweenDelay(20, 40);
    }
    
    private reDrawAscii(): void{
        // Draw a different ascii art depending on the step
        switch(this.step){
            case GiantNougatMonsterStep.ASLEEP:
                this.getRenderArea().drawArray(Database.getAscii("places/quests/giantNougatMonster/monster"));
            break;
            case GiantNougatMonsterStep.AWAKE:
                this.getRenderArea().drawArray(Database.getAscii("places/quests/giantNougatMonster/monsterAwake"));
            break;
            case GiantNougatMonsterStep.ANGRY:
                this.getRenderArea().drawArray(Database.getAscii("places/quests/giantNougatMonster/monsterAngry"));
            break;
        }
    }
}