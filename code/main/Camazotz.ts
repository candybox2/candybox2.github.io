///<reference path="QuestEntity.ts"/>

class Camazotz extends QuestEntity{
    // Are we moving towards the player?
    private tryToMoveAgainTimer: number;
    
    // Drop a demon timer
    private dropADemonTimer: number;
    
    // Distance from the player
    private distanceFromPlayer: number;
    
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("Camazotz, the bat god", "Camazotz, the bat god"),
              new RenderArea(22, 8),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(8, 1), new Pos(6, 2)),
                                         new CollisionBox(this, new Pos(2, 3), new Pos(18, 1)),
                                         new CollisionBox(this, new Pos(1, 4), new Pos(20, 1)),
                                         new CollisionBox(this, new Pos(0, 5), new Pos(22, 1)),
                                         new CollisionBox(this, new Pos(9, 6), new Pos(4, 1)),
                                         new CollisionBox(this, new Pos(10, 7), new Pos(2, 1))
                                        ),
              new QuestEntityMovement()
             );
        
        // Set the drop a demon timer default value
        this.resetDropADemonTimer();
        
        // Set the default distance from the player
        this.distanceFromPlayer = 5;
        
        // Set the default tryToMoveAgainTimer
        this.tryToMoveAgainTimer = 0;
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(false);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(5000);
        this.setHp(5000);
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawArray(Database.getAscii("places/quests/hell/camazotz"));
        this.setTransparency(new RenderTransparency(" ", "%"));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its claws", "its claws"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, 0), new Pos(24, 9))), 300));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setBetweenDelay(20, 100); // This delay because Camazotz is quite busy throwing enemies to the player
    }
    
    // update()
    public update(): void{
        // Handle the movement towards the player
        this.handleMovementTowardsPlayer();

        // Handle demon dropping
        this.handleDropADemon();
        
        // Call the mother class update method
        super.update();
    }
    
    // willeDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(1000000), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
    
    // Private methods
    private dropADemon(): void{
        // Create the demon
        var demon: Demon = new Demon(this.getQuest(), this.getGlobalPosition().plus(new Pos(8, 8)));
        
        // Set the health bar
        demon.setHealthBar(new QuestEntityHealthBar(demon, new Pos(6, 1)));
        
        // Add the demon
        this.getQuest().addEntity(demon);
    }
    
    private handleDropADemon(): void{
        // If it's time to add one
        if(this.dropADemonTimer < 0){
            // Drop a demon and reset the timer
            this.dropADemon();
            this.resetDropADemonTimer();
        }
        // Else
        else{
            // Decrese the timer
            this.dropADemonTimer -= 1;
        }
    }
    
    private handleMovementTowardsPlayer(): void{
        // If we try to move
        if(this.tryToMoveAgainTimer <= 0){
            // We go towards the player
            this.goTowards(this.getGlobalPosition(), this.getQuest().getGame().getPlayer().getGlobalPosition().plus(new Pos(this.distanceFromPlayer, 0)), 2, new Pos(2, 0), true);
            
            // We'll try to move again in 3 frames
            this.tryToMoveAgainTimer = 3;
        }
        // Else, we not moving, we decrese the timer, and possibly set we are moving to true
        else{
            this.tryToMoveAgainTimer -= 1;
        }
    }
    
    private resetDropADemonTimer(): void{
        this.dropADemonTimer = Random.between(8, 12);
    }
}