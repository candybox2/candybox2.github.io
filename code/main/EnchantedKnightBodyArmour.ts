///<reference path="EqItem.ts"/>

class EnchantedKnightBodyArmour extends EqItem{
    // Constructor
    constructor(){
        super("eqItemBodyArmoursEnchantedKnightBodyArmour",
              "eqItemBodyArmoursEnchantedKnightBodyArmourName",
              "eqItemBodyArmoursEnchantedKnightBodyArmourDescription",
              "eqItems/bodyArmours/enchantedKnightBodyArmour");
    }
    
    // Special ability
    public getSpecialAbility(): string{
        return "Dam. taken reduced by 80%, dam. inflicted divided by 2 (enchanted knight body armour)";
    }
    
    // hit()
    public hit(player: Player, quest: Quest, questEntity: QuestEntity, damage: number, reason: QuestEntityDamageReason): number{
        return Math.ceil(damage/2);
    }
    
    // inflictDamage()
    public inflictDamage(player: Player, quest: Quest, damage: number, reason: QuestEntityDamageReason): number{
        return Math.ceil(damage - damage*80/100);
    }
}