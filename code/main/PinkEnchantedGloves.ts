///<reference path="EqItem.ts"/>

class PinkEnchantedGloves extends EqItem{
    // Constructor
    constructor(){
        super("eqItemGlovesPinkEnchantedGloves",
              "eqItemGlovesPinkEnchantedGlovesName",
              "eqItemGlovesPinkEnchantedGlovesDescription",
              "eqItems/gloves/pinkEnchantedGloves");
    }
    
    // Special ability
    public getSpecialAbility(): string{
        return "Slowly regain your health points in quests (pink enchanted gloves).";
    }
    
    // update
    public update(player: Player, quest: Quest): void{
        player.heal(1);
    }
}