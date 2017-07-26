///<reference path="CandyMerchantItem.ts"/>

class CandyMerchantItem_LeatherGloves extends CandyMerchantItem{
    // The item can't be shown if the inventory isn't shown yet
    public canBeShown(): boolean{
        if(super.canBeShown() == false)
            return false;
        
        if(Saving.loadBool("statusBarUnlockedInventory") == false)
            return false;
        
        return true;
    }
}