///<reference path="EqItem.ts"/>

class RedEnchantedGloves extends EqItem{
    // The timer (to avoid casting fireballs too often..)
    private currentTimer: number = 0;
    private maxTimer: number = 5;
    
    // Constructor
    constructor(){
        super("eqItemGlovesRedEnchantedGloves",
              "eqItemGlovesRedEnchantedGlovesName",
              "eqItemGlovesRedEnchantedGlovesDescription",
              "eqItems/gloves/redEnchantedGloves");
    }
    
    // Special ability
    public getSpecialAbility(): string{
        return "Randomly cast small fireballs around you (red enchanted gloves).";
    }
    
    // update
    public update(player: Player, quest: Quest): void{
        this.currentTimer += 1;
        
        // If the timer is ready
        if(this.currentTimer >= this.maxTimer){
            // Cast the fireball
            this.castFireball(player, quest);
            // Reset the timer
            this.currentTimer = 0;
        }
    }
    
    // Private methods
    private castFireball(player: Player, quest: Quest): void{
        // Create the fireball
        var fireball: Fireball = new Fireball(quest,
                                              player.getSpellCastingPosition(),
                                              new Naming("A small fireball", "a small fireball"),
                                              new Color(ColorType.RED_ENCHANTED_GLOVES_FIREBALL),
                                              new Pos(2, 1),
                                              15,
                                              player.getAndPossiblyCreateSpellCastingDamageReason(new Naming("A small fireball", "a small fireball"))
                                            );
        
        // Set the direction
        fireball.setTargetTypeNoTarget(Algo.getRandomNotImmobileDirectionUpToThisSpeed(1).multiply(new Pos(2, 2)));
        
        // Add the entity
        quest.addEntity(fireball);
    }
}