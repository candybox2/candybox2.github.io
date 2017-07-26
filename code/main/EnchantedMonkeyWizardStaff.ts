///<reference path="MonkeyWizardStaffMotherClass.ts"/>

class EnchantedMonkeyWizardStaff extends MonkeyWizardStaffMotherClass{
    // The timer
    private timer: number;
    
    // Constructor
    constructor(){
        super("eqItemWeaponEnchantedMonkeyWizardStaff",
              "eqItemWeaponEnchantedMonkeyWizardStaffName",
              "eqItemWeaponEnchantedMonkeyWizardStaffDescription",
              "eqItems/weapons/enchantedMonkeyWizardStaff");
        
        // Set the timer
        this.timer = 0;
    }
    
    // Public getters
    public getQuestEntityWeapon(quest: Quest, player: Player): QuestEntityWeapon{
        var qew: QuestEntityWeapon = 
                 new QuestEntityWeapon(quest,
                                       player,
                                       new Naming("The monkey wizard staff (enchanted)", "the monkey wizard staff (enchanted)"),
                                       player.getClassicCollisionBoxCollection(),
                                       2
                                      );
        qew.getCloseCombatDelay().setFixedDelay(0);
        return qew;
    }
    
    // update()
    public update(player: Player, quest: Quest): void{
        // Handle the timer
        if(this.timer < 4) this.timer += 1;
        else{
            this.timer = 0;
            var ent: QuestEntity = this.getRandomEnemy(player, quest);
            if(ent != null) this.castPurpleBall(player, quest, ent);
        }
    }
}