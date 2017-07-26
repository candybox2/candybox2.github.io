///<reference path="CandyMerchantItem.ts"/>

class CandyMerchantItem_Lollipop extends CandyMerchantItem{
    // When we buy, we get one lollipop
    public buy(): void{
        super.buy();
        this.getGame().getLollipops().add(1);
    }
}