///<reference path="QuestEntity.ts"/>

class Wolf extends QuestEntity{
    // Wolf orientation
    private isLookingLeft: boolean;
    
    // Wolf current action (standing / running)
    private isStanding: boolean;
    
    // A timer used to take the decision to begin running (if null, we're not taking the decision to begin running)
    private takeTheDecisionToRunTimer: number;
    
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A wolf", "a wolf"),
              new RenderArea(7, 3),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 1), new Pos(7, 2))),
              new QuestEntityMovement()
             );
        
        // At first, we're not taking the decision to begin running
        this.takeTheDecisionToRunTimer = null;
        
        // Set the area transparency
        this.setTransparency(new RenderTransparency(" "));
        
        // At first we're looking left and standing
        this.setIsLookingLeft(true);
        this.setIsStanding(true);
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(45);
        this.setHp(45);
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its fangs", "its fangs"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, 0), new Pos(9, 3))), 10));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(2);
    }
    
    // update()
    public update(): void{
        // Calculate the distance from the player
        var distanceFromPlayer: Pos = this.getGlobalPosition().plus(new Pos(3, 0)).getDistance(this.getQuest().getGame().getPlayer().getGlobalPosition());
        
        // If the player is on our left
        if(distanceFromPlayer.x > 0){
            // We're looking left
            this.setIsLookingLeft(true);
        }
        // Else, the player is on our right
        else{
            // We're looking right
            this.setIsLookingLeft(false);
        }
        
        // If we're standing
        if(this.isStanding){
            // If we're not already taking the decision to run BUT the running movement would be possible
            if(this.takeTheDecisionToRunTimer == null && this.testNewGlobalPosition(this.getGlobalPosition().plus(new Pos(this.getRunningSpeed(), 0)))){
                // We take the decision to run by setting the timer
                this.takeTheDecisionToRunTimer = Random.between(2, 6);
            }
            // Else, if we already took the decision ro run
            else if(this.takeTheDecisionToRunTimer != null){
                // We decrease the timer
                this.takeTheDecisionToRunTimer -= 1;
                // If the timer is <= 0 and the running movement would be possible
                if(this.takeTheDecisionToRunTimer <= 0 && this.testNewGlobalPosition(this.getGlobalPosition().plus(new Pos(this.getRunningSpeed(), 0)))){
                    this.setIsStanding(false); // We run
                    this.takeTheDecisionToRunTimer = null; // Not taking any decision anymore
                }
            }
        }
        // Else, if we're running
        else{
            // If the running movement won't be possible next turn
            if(this.testNewGlobalPosition(this.getGlobalPosition().plus(new Pos(this.getRunningSpeed(), 0))) == false){
                // We stand
                this.setIsStanding(true);
            }
        }
        
        // Call the mother class update
        super.update();
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(100 + 50*Random.upTo(10)), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
    
    // Private methods
    private getRunningSpeed(): number{
        return (this.isLookingLeft? -1:1);
    }
    
    private reDrawArea(): void{
        this.getRenderArea().drawArray(Database.getAscii("places/quests/forest/wolf/" + (this.isLookingLeft? "left":"right") + (this.isStanding? "Standing":"Running")));
    }
    
    private setIsLookingLeft(isLookingLeft: boolean): void{
        // If the value is different
        if(isLookingLeft != this.isLookingLeft){
            this.isLookingLeft = isLookingLeft; // Set the value
            this.updateQuestEntityMovementOffset(); // Update the movement
            this.reDrawArea(); // Update the area
        }
    }
    
    private setIsStanding(isStanding: boolean): void{
        // If the value is different
        if(isStanding != this.isStanding){
            this.isStanding = isStanding; // Set the value
            this.updateQuestEntityMovementOffset(); // Update the movement
            this.reDrawArea(); // Update the area
        }
    }
    
    private updateQuestEntityMovementOffset(): void{
        // If we're standing
        if(this.isStanding){
            // No movement
            this.getQuestEntityMovement().setOffset(new Pos(0, 0));
        }
        // Else, we're running
        else{
            // Set the movement depending on our orientation
            this.getQuestEntityMovement().setOffset(new Pos(this.getRunningSpeed(), 0));
        }
    }
}