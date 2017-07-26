///<reference path="QuestEntity.ts"/>

class Knight extends QuestEntity{
    // Movement
    private moving: boolean; // Is the knight moving?
    private currentAsciiNumber: number; // Between 1 and 5 - 1 is not moving
    
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A knight", "a knight"),
              new RenderArea(15, 6),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(3, 1), new Pos(1, 1)),
                                         new CollisionBox(this, new Pos(6, 1), new Pos(3, 1)),
                                         new CollisionBox(this, new Pos(0, 2), new Pos(9, 1)),
                                         new CollisionBox(this, new Pos(2, 3), new Pos(13, 1)),
                                         new CollisionBox(this, new Pos(3, 4), new Pos(9, 1)),
                                         new CollisionBox(this, new Pos(4, 5), new Pos(2, 1)),
                                         new CollisionBox(this, new Pos(9, 5), new Pos(2, 1))
                                        ),
              new QuestEntityMovement(new Pos(0, 0))
             );
        
        // Default movement related variables values
        this.moving = false;
        this.currentAsciiNumber = 1;
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(150);
        this.setHp(150);
        
        // Set the ascii art and the transparent character
        this.reDrawAscii();
        this.setTransparency(new RenderTransparency(" ", "%"));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("A sword", "a sword"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, 0), new Pos(17, 7))), 70));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(8);
    }
    
    // update()
    public update(): void{
        // If we're not moving
        if(this.moving == false){
            // If we're able to move now
            if(this.testNewGlobalPosition(this.getGlobalPosition().plus(new Pos(-3, 0)))){
                this.moving = true; // We move
                this.getQuestEntityMovement().setOffset(new Pos(-3, 0)); // The movement
            }
        }
        // Else, if we're moving
        else{
            // If we're not able to move anymore
            if(this.testNewGlobalPosition(this.getGlobalPosition().plus(new Pos(-3, 0))) == false){
                this.moving = false; // We stop moving
                this.getQuestEntityMovement().setOffset(new Pos(0, 0)); // The movement
                this.currentAsciiNumber = 1; // currentAsciiNumber
                this.reDrawAscii();
            }
            // Else we're really moving
            else{
                // Change the currentAsciiNumber
                this.currentAsciiNumber += 1;
                if(this.currentAsciiNumber > 5) this.currentAsciiNumber = 1;
                this.reDrawAscii();
            }
        }
        
        // Call the mother class update
        super.update();
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(800 + Random.upTo(15)*100), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        if(Random.oneChanceOutOf(5)) this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "eqItemBodyArmoursKnightBodyArmour", "You found a body armour on a knight", "You gain a knight body armour"));
    }
    
    // Private methods
    private reDrawAscii(): void{
        this.getRenderArea().drawArray(Database.getAscii("places/quests/castleEntrance/knight" + this.currentAsciiNumber.toString()));
    }
}