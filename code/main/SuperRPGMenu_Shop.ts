///<reference path="SuperRPGMenu_Ingame.ts"/>

class SuperRPGMenu_Shop extends SuperRPGMenu_Ingame{
    // Constructor
    constructor(superRPG: SuperRPG){
        super(superRPG, "places/village/thirdHouseGames/SuperRPG/shop", 0);
    }
    
    // Public methods
    public addBuyingDefenseItem(defenseItem: string, defense: number, price: number): void{
        this.addEntry(new SuperRPGMenuEntry(defenseItem + " (" + price + ")", new CallbackCollection(this.buyDefenseItem.bind(this, defenseItem, defense, price))));
    }
    
    public addBuyingHealthCrystal(): void{
        this.addEntry(new SuperRPGMenuEntry("Health crystal (100)", new CallbackCollection(this.buyHealthCrystal.bind(this))));
    }
    
    public addBuyingHealthPendant(): void{
        this.addEntry(new SuperRPGMenuEntry("Health pendant (30)", new CallbackCollection(this.buyHealthPendant.bind(this))));
    }
    
    public addBuyingHealthPotion(): void{
        this.addEntry(new SuperRPGMenuEntry("Health potion (5)", new CallbackCollection(this.buyHealthPotion.bind(this))));
    }
    
    public addBuyingSuperHealthPotion(): void{
        this.addEntry(new SuperRPGMenuEntry("Health potion ++ (25)", new CallbackCollection(this.buySuperHealthPotion.bind(this))));
    }
    
    public addBuyingWeapon(weapon: string, damage: number, price: number): void{
        this.addEntry(new SuperRPGMenuEntry(weapon + " (" + price + ")", new CallbackCollection(this.buyWeapon.bind(this, weapon, damage, price))));
    }
    
    public addQuitTheShop(): void{
        this.addEntry(new SuperRPGMenuEntry("Quit the shop", new CallbackCollection(this.getSuperRPG().nextFloorStep.bind(this.getSuperRPG()))));
    }
    
    // Private methods
    private buyDefenseItem(defenseItem: string, defense: number, price: number): void{
        if(this.getSuperRPG().getCoins() >= price && this.getSuperRPG().getDefense() < defense){
            this.getSuperRPG().setCoins(this.getSuperRPG().getCoins()-price);
            this.getSuperRPG().setDefenseItem(defenseItem);
            this.getSuperRPG().setDefense(defense);
        }
    }
    
    private buyHealthCrystal(): void{
        if(this.getSuperRPG().getCoins() >= 100){
            this.getSuperRPG().setCoins(this.getSuperRPG().getCoins()-100);
            this.getSuperRPG().setMaxHp(this.getSuperRPG().getMaxHp()+20);
            this.getSuperRPG().setHp(this.getSuperRPG().getHp()+20);
        }
    }
    
    private buyHealthPendant(): void{
        if(this.getSuperRPG().getCoins() >= 30){
            this.getSuperRPG().setCoins(this.getSuperRPG().getCoins()-30);
            this.getSuperRPG().setMaxHp(this.getSuperRPG().getMaxHp()+5);
            this.getSuperRPG().setHp(this.getSuperRPG().getHp()+5);
        }
    }
    
    private buyHealthPotion(): void{
        if(this.getSuperRPG().getCoins() >= 5 && this.getSuperRPG().getHp() < this.getSuperRPG().getMaxHp()){
            this.getSuperRPG().setCoins(this.getSuperRPG().getCoins()-5);
            this.getSuperRPG().setHp(this.getSuperRPG().getHp()+8);
        }
    }
    
    private buySuperHealthPotion(): void{
        if(this.getSuperRPG().getCoins() >= 25 && this.getSuperRPG().getHp() < this.getSuperRPG().getMaxHp()){
            this.getSuperRPG().setCoins(this.getSuperRPG().getCoins()-25);
            this.getSuperRPG().setHp(this.getSuperRPG().getHp()+50);
        }
    }
    
    private buyWeapon(weapon: string, damage: number, price: number): void{
        if(this.getSuperRPG().getCoins() >= price && this.getSuperRPG().getDamage() < damage){
            this.getSuperRPG().setCoins(this.getSuperRPG().getCoins()-price);
            this.getSuperRPG().setWeapon(weapon);
            this.getSuperRPG().setDamage(damage);
        }
    }
}