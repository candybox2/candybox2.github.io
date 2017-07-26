///<reference path="EqItem.ts"/>

class RocketBoots extends EqItem{
    // Constructor
    constructor(){
        super("eqItemBootsRocketBoots",
              "eqItemBootsRocketBootsName",
              "eqItemBootsRocketBootsDescription",
              "eqItems/boots/rocketBoots");
    }
    
    // Special ability
    public getSpecialAbility(): string{
        return "Jump in mid-air without limit (rocket boots).";
    }
}