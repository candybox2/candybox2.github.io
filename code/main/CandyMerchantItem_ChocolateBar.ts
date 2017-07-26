///<reference path="CandyMerchantItem.ts"/>

class CandyMerchantItem_ChocolateBar extends CandyMerchantItem{
    // When we buy, we get one chocolate bar
    public buy(): void{
        super.buy();
        this.getGame().getChocolateBars().add(1);
    }
}