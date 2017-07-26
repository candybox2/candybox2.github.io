///<reference path="GridItem.ts"/>

class XinopherydonClaw extends GridItem{
    public hit(player: Player, quest: Quest, questEntity: QuestEntity, damage: number, reason: QuestEntityDamageReason): number{
        return damage*2;
    }
}