///<reference path="Fireball.ts"/>

class MonkeyWizardMagicalPurpleBall extends Fireball{
    // Timer before going down (if null, we should not go down)
    private timer: number;
    
    // Constructor
    constructor(quest: Quest, pos: Pos, naming: Naming, color: Color, size: Pos, damage: number, questEntityDamageReason: QuestEntityDamageReason, timer: number){
        // Call the mother class constructor
        super(quest, pos, naming, color, size, damage, questEntityDamageReason);
        
        // Set the timer
        this.timer = timer;
    }
    
    // Public methods
    public update(): void{
        // If the timer isn't null (which means we should be stored and then go down)
        if(this.timer != null){
            // If the timer is > 0, decrease it
            if(this.timer > 0) this.timer -= 1;
            // Else, if the timer is <= 0, we go towards the player now!
            else{
                this.timer = null; // No more timer
                this.setTargetTypeTargetEntity(this.getQuest().getGame().getPlayer());
            }
        }
        
        // Call the fireball update method
        super.update();
    }
}