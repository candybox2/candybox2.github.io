///<reference path="Fireball.ts"/>

class DeveloperMagicBall extends Fireball{
    // The time to live
    private timeToLive: number;
    
    // Did we target the player already?
    private playerTargeted: boolean = false;
    
    // Constructor
    constructor(quest: Quest, pos: Pos, naming: Naming, color: Color, size: Pos, damage: number, questEntityDamageReason: QuestEntityDamageReason, timeToLive: number){
        // Call the mother class constructor
        super(quest, pos, naming, color, size, damage, questEntityDamageReason);
        
        // Set the time to live
        this.timeToLive = timeToLive;
    }
    
    // Public methods
    public update(): void{
        // If the player isn't targeted yet
        if(this.playerTargeted == false){
        // If it's time to target the player
            if(this.timeToLive <= 0){
                // We target it
                this.setTargetTypeTargetEntity(this.getQuest().getGame().getPlayer(), null, new Pos(2, 1));
            }
            else this.timeToLive -= 1;
        }
        
        // Call the mother class update method
        super.update();
    }
    
    // willDie()
    public willDie(): void{}
}