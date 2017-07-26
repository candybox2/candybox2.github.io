///<reference path="EqItem.ts"/>

class SorceressHat extends EqItem{
    // Constructor
    constructor(){
        super("eqItemHatSorceressHat",
              "eqItemHatSorceressHatName",
              "eqItemHatSorceressHatDescription",
              "eqItems/hats/sorceressHat");
    }
    
    // Special ability
    public getSpecialAbility(): string{
        return "Enhances your spells & potions effects (sorceress hat).";
    }
}