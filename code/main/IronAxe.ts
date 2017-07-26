///<reference path="EqItem.ts"/>

class IronAxe extends EqItem{
    // Constructor
    constructor(){
        super("eqItemWeaponIronAxe",
              "eqItemWeaponIronAxeName",
              "eqItemWeaponIronAxeDescription",
              "eqItems/weapons/ironAxe");
    }
    
    // Public getters
    public getQuestEntityWeapon(quest: Quest, player: Player): QuestEntityWeapon{
        var qew: QuestEntityWeapon = 
                 new QuestEntityWeapon(quest,
                                       player,
                                       new Naming("An iron axe", "an iron axe"),
                                       player.getClassicCollisionBoxCollection(),
                                       3
                                      );
        qew.getCloseCombatDelay().setFixedDelay(3, 0);
        return qew;
    }
}