///<reference path="CandyMerchantItem.ts"/>

class CandyMerchantItem_MerchantHat extends CandyMerchantItem{
    // When we buy, we get the merchant hat
    public buy(): void{
        super.buy();
        this.getGame().gainItem("eqItemHatMerchantHat");
    }
    
    // The item can't be clicked if the inventory isn't shown yet
    public canBeClicked(): boolean{
        if(super.canBeClicked() == false)
            return false;
        
        if(Saving.loadBool("statusBarUnlockedInventory") == false)
            return false;
        
        return true;
    }
}