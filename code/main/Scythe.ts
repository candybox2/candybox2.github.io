///<reference path="EqItem.ts"/>

class Scythe extends EqItem{
    // Constructor
    constructor(){
        super("eqItemWeaponScythe",
              "eqItemWeaponScytheName",
              "eqItemWeaponScytheDescription",
              "eqItems/weapons/scythe");
    }
    
    // Public getters
    public getQuestEntityWeapon(quest: Quest, player: Player): QuestEntityWeapon{
        var qew: QuestEntityWeapon = 
                 new QuestEntityWeapon(quest,
                                       player,
                                       new Naming("A scythe", "a scythe"),
                                       player.getClassicCollisionBoxCollection(),
                                       21
                                      );
        qew.getCloseCombatDelay().setFixedDelay(0);
        return qew;
    }
}