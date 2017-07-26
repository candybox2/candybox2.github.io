///<reference path="QuestEntity.ts"/>

class Mosquito extends QuestEntity{
    // The ground y position
    private groundYPosition: number;
    
    // The perfect position above the ground (can very depending on the mosquitos)
    private perfectYPositionAboveGround: number;
    
    // Constructor
    constructor(quest: Quest, pos: Pos, groundYPosition: number){
        super(quest,
              pos,
              new Naming("A forest mosquito", "a forest mosquito"),
              new RenderArea(1, 1),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(1, 1))),
              new QuestEntityMovement()
             );
        
        // Set the ground y position from the value given in parameter
        this.groundYPosition = groundYPosition;
        
        // Set the perfect position above the ground
        this.perfectYPositionAboveGround = Random.between(8, 13);
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(false);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(1);
        this.setHp(1);
        
        // Set the ascii art (well, it's actually just a ".")
        this.getRenderArea().drawString(".");
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("A proboscis", "a proboscis"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(3, 3))), 12));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setOnceThenWaitDelay(20);
    }
    
    // update()
    public update(): void{
        // Calculate the distance from the player
        var distanceFromPlayer: Pos = this.getGlobalPosition().getDistance(this.getQuest().getGame().getPlayer().getGlobalPosition().plus(new Pos(1, 0)));
        

            // Go towards the player
            this.goTowards(this.getGlobalPosition(), this.getQuest().getGame().getPlayer().getGlobalPosition().plus(new Pos(1, 0)));
        
        
        // Call the mother class update method
        super.update();
    }
}