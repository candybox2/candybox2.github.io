///<reference path="EqItem.ts"/>

class TrollBludgeon extends EqItem{
    // Constructor
    constructor(){
        super("eqItemWeaponTrollBludgeon",
              "eqItemWeaponTrollBludgeonName",
              "eqItemWeaponTrollBludgeonDescription",
              "eqItems/weapons/trollBludgeon");
    }
    
    // Public getters
    public getQuestEntityWeapon(quest: Quest, player: Player): QuestEntityWeapon{
        var qew: QuestEntityWeapon = 
                 new PlayerBludgeon(quest,
                                       player,
                                       new Naming("The troll's bludgeon", "the troll's bludgeon"),
                                       player.getClassicCollisionBoxCollection()
                                      );
        qew.getCloseCombatDelay().setFixedDelay(6);
        return qew;
    }
}