///<reference path="EqItem.ts"/>

class OctopusKingCrownWithObsidian extends EqItem{
    // The timer (to avoid casting fireballs too often..)
    private currentTimer: number;
    
    // Constructor
    constructor(){
        super("eqItemHatOctopusKingCrownWithObsidian",
              "eqItemHatOctopusKingCrownWithObsidianName",
              "eqItemHatOctopusKingCrownWithObsidianDescription",
              "eqItems/hats/octopusKingCrownWithObsidian");
        
        // Reset the timer for the first time
        this.resetTimer();
    }
    
    // Special ability
    public getSpecialAbility(): string{
        return "Summon the Octopus King once in a while to help you.";
    }
    
    // update
    public update(player: Player, quest: Quest): void{
        this.currentTimer -= 1;
        
        // If the timer is ready
        if(this.currentTimer <= 0){
            // Summon the king
            if(this.summonOctopusKing(player, quest)){
                // If it worked, reset the timer
                this.resetTimer();
            }
        }
    }
    
    // Private methods
    private summonOctopusKing(player: Player, quest: Quest): boolean{
        // Create the king
        var king: PlayerSummonedOctopusKing = new PlayerSummonedOctopusKing(quest, Random.fromPosition(new Pos(quest.getRealQuestSize().x-1, quest.getRealQuestSize().y-1)));
        
        // If we manage to add it, we return true
        if(quest.addEntity(king))
            return true;
        
        // No king added, we return false
        return false;
    }
    
    private resetTimer(): void{
        this.currentTimer = Random.between(60, 120);
    }
}