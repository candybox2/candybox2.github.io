///<reference path="SuperRPGMenu_Ingame.ts"/>

class SuperRPGMenu_Monster extends SuperRPGMenu_Ingame{
    // Damage and defense
    private damage: number;
    private defense: number;
    
    // Hp and max hp
    private hp: number;
    private maxHp: number;
    
    // The coins the monster will give when it will die
    private coins: number;
    
    // Constructor
    constructor(superRPG: SuperRPG){
        super(superRPG, "", 0);
    }
    
    // Public methods
    public addUsualEntries(): void{
        this.addEntry(new SuperRPGMenuEntry("Attack", new CallbackCollection(this.playerAttacks.bind(this))));
    }
    
    public draw(renderArea: RenderArea): void{
        // Draw the monster damage
        renderArea.drawString("ATK " + this.damage, 0, 11);
        
        // Draw the monster defense
        renderArea.drawString("DEF " + this.defense, 7, 11);
        
        // Draw the monster hp and max hp
        renderArea.drawString("HP " + this.hp + "/" + this.maxHp, 14, 11);
        
        // Call the mother class draw method
        super.draw(renderArea);
    }
    
    public setAbstract(atk: number, def: number, coins: number, hp: number): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/" + Random.fromArray(["cross", "mobius", "triforce", "randomShape", "circle", "dna", "hive", "star"]), atk, def, coins, hp);
    }
    
    public setBabyVampire(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/babyVampire", 10, 2, 8, 30);
    }
    
    public setBlob(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/blob", Random.between(1, 3), 0, Random.between(5, 8), 3);
    }
    
    public setBomb(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/bomb", 99, 0, 0, 12);
    }
    
    public setChest(coins: number): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/chest", 0, 0, coins, 10);
    }
    
    public setCorpse1(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/corpse1", 0, 0, (Random.flipACoin()? 0 : Random.between(1, 300)), 0);
    }
    
    public setCorpse2(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/corpse2", 0, 0, (Random.flipACoin()? 0 : Random.between(1, 300)), 0);
    }
    
    public setDragon(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/dragon", Random.between(28, 32), Random.between(7, 9), 1000, Random.fromArray([45, 50, 55]));
    }
    
    public setFerociousBlob(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/ferociousBlob", Random.between(2, 4), 0, Random.between(7, 10), 2);
    }
    
    public setFerociousGoblin(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/ferociousGoblin", 5, 3, 20, 5);
    }
    
    public setFerociousSkeleton(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/ferociousSkeleton", 8, 1, 40, 10);
    }
    
    public setGoblin(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/goblin", 4, 1, 15, 5);
    }
    
    public setSkeletonOrBillGatesSkeleton(): void{
        // Bill gates skeleton
        if(Random.oneChanceOutOf(10))
            this.setMonster("places/village/thirdHouseGames/SuperRPG/billGatesSkeleton", 6, 1, 50, 7);
        // Normal skeleton
        else
            this.setMonster("places/village/thirdHouseGames/SuperRPG/skeleton", 6, 1, 25, 7);
    }
    
    public setSpider(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/spider", 10, 5, Random.between(100, 200), 25);
    }
    
    public setSpiders(): void{
        this.setMonster("places/village/thirdHouseGames/SuperRPG/spiders", 9, 2, 9, 15);
    }
    
    public setThing(): void{
        switch(Random.between(0, 2)){
            case 0: this.setMonster("places/village/thirdHouseGames/SuperRPG/thing", 20, 3, 120, 10); break;
            case 1: this.setMonster("places/village/thirdHouseGames/SuperRPG/thing", 12, 6, 120, 30); break;
            case 2: this.setMonster("places/village/thirdHouseGames/SuperRPG/thing", 14, 4, 120, 20); break;
        }
    }
    
    // Private methods
    private playerAttacks(): void{
        // Variable used for damage calculation
        var damage: number;
        
        // We lose hp
        damage = this.getSuperRPG().getDamage() - this.defense;
        if(damage > 0){
            this.hp -= damage;
            // If we have 0 or less hp, we get the coins, go to the next floor step and return
            if(this.hp <= 0){
                this.getSuperRPG().setCoins(this.getSuperRPG().getCoins() + this.coins);
                this.getSuperRPG().nextFloorStep();
                return;
            }
        }
        
        // We didn't return : it means we're still alive : we counter attack
        damage = this.damage - this.getSuperRPG().getDefense();
        if(damage > 0){
            this.getSuperRPG().setHp(this.getSuperRPG().getHp() - damage);
        }
    }
    
    private setMonster(asciiName: string, damage: number, defense: number, coins: number, hp: number, maxHp: number = null): void{
        // Set from the parameters
        this.setAsciiName(asciiName);
        this.damage = (this.getSuperRPG().getHardmode()? Math.floor(damage*1.2) : damage);
        this.defense = (this.getSuperRPG().getHardmode()? Math.floor(defense*1.2) : defense);
        this.coins = (this.getSuperRPG().getHardmode()? Math.ceil(coins*0.8) : coins);
        this.hp = (this.getSuperRPG().getHardmode()? Math.floor(hp*1.2) : hp);
        if(maxHp == null)
            this.maxHp = this.hp;
        else this.maxHp = (this.getSuperRPG().getHardmode()? Math.floor(maxHp*1.2) : maxHp);
    }
}