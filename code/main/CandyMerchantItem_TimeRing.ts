///<reference path="CandyMerchantItem.ts"/>

class CandyMerchantItem_TimeRing extends CandyMerchantItem{
    // When we buy, we get the time ring
    public buy(): void{
        super.buy();
        this.getGame().gainItem("gridItemPossessedTimeRing");
    }
    
    // The item can't be shown if the inventory isn't shown yet
    public canBeShown(): boolean{
        if(super.canBeShown() == false)
            return false;
        
        if(Saving.loadBool("statusBarUnlockedInventory") == false)
            return false;
        
        return true;
    }
}