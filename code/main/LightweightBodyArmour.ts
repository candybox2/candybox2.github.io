///<reference path="EqItem.ts"/>

class LightweightBodyArmour extends EqItem{
    // Constructor
    constructor(){
        super("eqItemBodyArmoursLightweightBodyArmour",
              "eqItemBodyArmoursLightweightBodyArmourName",
              "eqItemBodyArmoursLightweightBodyArmourDescription",
              "eqItems/bodyArmours/lightweightBodyArmour");
    }
    
    // Special ability
    public getSpecialAbility(): string{
        return "Damage taken reduced by 15% (lightweight body armour)";
    }
    
    // inflictDamage()
    public inflictDamage(player: Player, quest: Quest, damage: number, reason: QuestEntityDamageReason): number{
        return Math.ceil(damage - damage*15/100);
    }
}