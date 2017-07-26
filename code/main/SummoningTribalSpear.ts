///<reference path="EqItem.ts"/>

class SummoningTribalSpear extends EqItem{
    // Time since we last summoned a warrior
    private timeSinceSummon: number = 0;
    
    // Constructor
    constructor(){
        super("eqItemWeaponSummoningTribalSpear",
              "eqItemWeaponSummoningTribalSpearName",
              "eqItemWeaponSummoningTribalSpearDescription",
              "eqItems/weapons/summoningTribalSpear");
    }
    
    // Public getters
    public getQuestEntityWeapon(quest: Quest, player: Player): QuestEntityWeapon{
        var qew: QuestEntityWeapon = 
                 new QuestEntityWeapon(quest,
                                       player,
                                       new Naming("A summoning tribal spear", "a summoning tribal spear"),
                                       player.getClassicCollisionBoxCollection(),
                                       10
                                      );
        qew.getCloseCombatDelay().setFixedDelay(2);
        return qew;
    }
    
    // Special ability
    public getSpecialAbility(): string{
        return "Frequently summons tribe warriors fighting on your side (summoning tribal spear).";
    }
    
    // update()
    public update(player: Player, quest: Quest): void{
        this.timeSinceSummon += 1;
        
        if(this.timeSinceSummon > 35){
            this.summon(player, quest);
        }
    }
    
    // Private methods
    private summon(player: Player, quest: Quest): void{
        // Create the warrior
        var warrior: PlayerSummonedTribeWarrior = new PlayerSummonedTribeWarrior(quest, player.getSpellCastingPosition().plus(new Pos(1, -3)));
        
        // Add the health bar
        warrior.setHealthBar(new QuestEntityHealthBar(warrior, new Pos(4, 1)));
        
        // Add it to the quest
        quest.addEntity(warrior)  
        
        // Reset the summon time
        this.timeSinceSummon = 0;
    }
}