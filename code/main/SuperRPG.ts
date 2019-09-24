///<reference path="ThirdHouseGame.ts"/>

Saving.registerBool("SuperRPGReward1", false);
Saving.registerBool("SuperRPGReward2", false);
Saving.registerBool("SuperRPGReward3", false);
Saving.registerBool("SuperRPGReward4", false);
Saving.registerBool("SuperRPGUnlockedHardmode", false);

class SuperRPG extends ThirdHouseGame{
    // The global step of the game (splash screen, the menu, or the game itself
    private step: SuperRPGStep = SuperRPGStep.SPLASH_SCREEN;

    // The timer used for the splash screen
    private splashScreenTimer: number = 39;
    
    // The current menu
    private menu: SuperRPGMenu = null;
     
    // Should we exit the game?
    private shouldExitGame: boolean = false;
    
    // Gameplay variables
    private floor: number; // The current floor
    private floorStep: SuperRPGFloorStep; // The current floor step (at the shop, the first monster, etc)
    private coins: number; // How many coins do we have?
    private hp: number; // How many hp?
    private maxHp: number; // The max hp
    private weapon: string; // The weapon
    private damage: number; // Damage dealth by the weapon
    private defenseItem: string; // Item used for defense
    private defense: number; // Defense
    
    // The reward (used when we lose)
    private reward: number;
                                    
    // Do we play in hardmode?
    private hardmode: boolean;
    
    // Public methods
    public exitGame(): void{
        this.shouldExitGame = true;
    }
    
    public nextFloorStep(): void{
        switch(this.floorStep){
            case SuperRPGFloorStep.SHOP:
                this.floorStep = SuperRPGFloorStep.MONSTER1;
                this.goToMonster();
            break;
            case SuperRPGFloorStep.MONSTER1:
                this.floorStep = SuperRPGFloorStep.MONSTER2;
                this.goToMonster();
            break;
            case SuperRPGFloorStep.MONSTER2:
                this.floorStep = SuperRPGFloorStep.MONSTER3;
                this.goToMonster();
            break;
            case SuperRPGFloorStep.MONSTER3:
                this.floorStep = SuperRPGFloorStep.SHOP;
                this.floor += 1;
                this.goToShop();
            break;
        }
    }
    
    public startGame(hardmode: boolean): void{
        // Set the hardmode (from parameter)
        this.hardmode = hardmode;
        
        // Set various stuff
        this.floor = 0;
        this.floorStep = SuperRPGFloorStep.SHOP;
        this.coins = 15;
        this.hp = 10;
        this.maxHp = 10;
        this.weapon = "Your fists";
        this.damage = 1;
        this.defenseItem = "Nothing";
        this.defense = 0;
        // Load the shop
        this.goToShop();
    }
    
    public run(): boolean{
        // To store the return value
        var returnValue: boolean = false;
        
        // If we should exit the game, we do so now
        if(this.shouldExitGame)
            return true;
        
        // Reset the area
        this.getRenderArea().resetAllButSize();
        
        // Do something different depending on the step
        switch(this.step){
            case SuperRPGStep.SPLASH_SCREEN:
                this.drawSplashScreen();
                returnValue = this.runSplashScreen();
            break;
            case SuperRPGStep.GAME:
                this.drawGame();
                returnValue = this.runGame();
            break;
            case SuperRPGStep.LOSE:
                this.drawLose();
                returnValue = false;
            break;
        }
        
        // We return
        return returnValue;
    }
    
    // Public getters
    public getCoins(): number{
        return this.coins;
    }
    
    public getDamage(): number{
        return this.damage;
    }
    
    public getDefense(): number{
        return this.defense;
    }
    
    public getDefenseItem(): string{
        return this.defenseItem;
    }
    
    public getFloor(): number{
        return this.floor;
    }
    
    public getFloorStep(): SuperRPGFloorStep{
        return this.floorStep;
    }
    
    public getHardmode(): boolean{
        return this.hardmode;
    }
    
    public getHp(): number{
        return this.hp;
    }
    
    public getMaxHp(): number{
        return this.maxHp;
    }
    
    public getWeapon(): string{
        return this.weapon;
    }
    
    // Public setters
    public setCoins(coins: number): void{
        this.coins = coins;
    }
    
    public setDamage(damage: number): void{
        this.damage = damage;
    }
    
    public setDefense(defense: number): void{
        this.defense = defense;
    }
    
    public setDefenseItem(defenseItem: string): void{
        this.defenseItem = defenseItem;
    }
    
    public setHp(hp: number): void{
        this.hp = hp;
        
        // If we have more hp than the maximum, we correct that
        if(this.hp > this.maxHp)
            this.hp = this.maxHp;
        
        // If we have 0 or less hp, we lose!!
        if(this.hp <= 0)
            this.goToLose();
    }
    
    public setMaxHp(maxHp: number): void{
        this.maxHp = maxHp;
    }
    
    public setWeapon(weapon: string): void{
        this.weapon = weapon;
    }
    
    // Private methods
    private drawGame(): void{
        this.menu.draw(this.getRenderArea());
    }
    
    private drawLose(): void{
        this.getRenderArea().drawArray(Database.getAscii("places/village/thirdHouseGames/SuperRPG/youLose"), 8, 1);
        if(this.reward == 0) this.getRenderArea().drawString("At floor " + this.floor + ". And got no candies.", 8, 7);
        else this.getRenderArea().drawString("At floor " + this.floor + ". And got " + this.reward + " candies.", 8, 7);
    }
    
    private drawSplashScreen(): void{
        this.getRenderArea().drawArray(Database.getAscii("places/village/thirdHouseGames/SuperRPG/splashScreen"), -67 + this.splashScreenTimer*3, 2);
    }
    
    private getCandiesWeWillGain(): number{
        // The reward
        var reward: number = 0;
        
        // Test the first reward
        if(Saving.loadBool("SuperRPGReward1") == false && this.floor > 5){
            reward += 100;
            Saving.saveBool("SuperRPGReward1", true);
        }
        
        // Test the second reward
        if(Saving.loadBool("SuperRPGReward2") == false && this.floor > 10){
            reward += 1000;
            Saving.saveBool("SuperRPGReward2", true);
        }
        
        // Test the third reward
        if(Saving.loadBool("SuperRPGReward3") == false && this.floor > 15){
            reward += 10000;
            Saving.saveBool("SuperRPGReward3", true);
        }
        
        // Test the fourth reward
        if(Saving.loadBool("SuperRPGReward4") == false && this.floor > 20){
            reward += 30000;
            Saving.saveBool("SuperRPGReward4", true);
            Saving.saveBool("SuperRPGUnlockedHardmode", true);
        }
        
        // We return the reward
        return reward;
    }
    
    private goToLose(): void{
        // No more menu
        this.menu = null;
        
        // Change the step
        this.step = SuperRPGStep.LOSE;
        
        // Get the candies
        this.reward = this.getCandiesWeWillGain();
        this.getThirdHouse().getGame().getCandies().add(this.reward);
    }
    
    private goToMainMenu(): void{
        // Change the step
        this.step = SuperRPGStep.GAME;
        
        // Set the main menu
        this.menu = new SuperRPGMenu_Main(this);
    }
    
    private goToMonster(): void{
        // Create the new menu
        var menu: SuperRPGMenu_Monster = new SuperRPGMenu_Monster(this);
        
        // Add the entry used to quit the shop
        menu.addUsualEntries();
        
        // Set the monster / add entries, depending on the floor
        switch(this.floor){
            case 0:
                if(Random.oneChanceOutOf(100)) menu.setChest(20);
                else menu.setBlob();
            break;
            case 1:
                if(Random.oneChanceOutOf(100)) menu.setChest(30);
                else if(Random.flipACoin())
                    menu.setBlob();
                else
                    menu.setFerociousBlob();
            break;
            case 2:
                if(Random.oneChanceOutOf(100)) menu.setChest(40);
                else if(Random.flipACoin()){
                    if(Random.oneChanceOutOf(5))
                        menu.setBlob();
                    else
                        menu.setFerociousBlob();
                }
                else menu.setGoblin();
            break;
            case 3:
                if(Random.oneChanceOutOf(100)) menu.setChest(50);
                else if(this.floorStep == SuperRPGFloorStep.MONSTER3)
                    menu.setGoblin();
                else menu.setFerociousGoblin();
            break;
            case 4:
                if(Random.oneChanceOutOf(100)) menu.setChest(60);
                else if(Random.oneChanceOutOf(3))
                    menu.setFerociousGoblin();
                else
                    menu.setSkeletonOrBillGatesSkeleton();
            break;
            case 5:
                if(Random.oneChanceOutOf(100)) menu.setChest(70);
                else if(Random.oneChanceOutOf(3))
                    menu.setSkeletonOrBillGatesSkeleton();
                else
                    menu.setFerociousSkeleton();
            break;
            case 6:
                if(Random.oneChanceOutOf(100)) menu.setChest(80);
                else menu.setFerociousSkeleton();
            break;
            case 7:
                // Big spider
                if(this.floorStep == SuperRPGFloorStep.MONSTER3)
                    menu.setSpider();
                // Small spiders
                else
                    menu.setSpiders();
            break;
            case 8:
                if(Random.oneChanceOutOf(100)) menu.setChest(100);
                else
                    menu.setBabyVampire();
            break;
            case 9:
                if(Random.oneChanceOutOf(100)) menu.setChest(110);
                else{
                    if(this.floorStep == SuperRPGFloorStep.MONSTER2)
                        menu.setSpiders();
                    else menu.setSpider();
                }
            break;
            case 10:
                if(Random.oneChanceOutOf(100)) menu.setChest(120);
                else
                    menu.setThing();
            break;
            case 11:
                if(Random.oneChanceOutOf(100)) menu.setChest(130);
                else menu.setSpider();
            break;
            case 12:
                if(Random.flipACoin()) menu.setChest(140);
                else menu.setBomb();
            break;
            case 13:
                switch(this.floorStep){
                    case SuperRPGFloorStep.MONSTER1: menu.setCorpse1(); break;
                    case SuperRPGFloorStep.MONSTER2: menu.setCorpse2(); break;
                    case SuperRPGFloorStep.MONSTER3: menu.setDragon(); break;
                }
            break;
            default:
                menu.setAbstract(10 + (this.floor-14)*12, 0, Math.ceil(500*(1/(this.floor-13))), 30 + (this.floor-13)*3);
            break;
        }
        
        // Set the menu
        this.menu = menu;
    }
    
    private goToShop(): void{
        // Create the new menu
        var menu: SuperRPGMenu_Shop = new SuperRPGMenu_Shop(this);
        
        // Add different items depending on the floor
        switch(this.floor){
            case 0:
                menu.addBuyingWeapon("Wooden sword", 2, 10);
                menu.addBuyingDefenseItem("Wooden shield", 1, 10);
            break;
            case 1:
                menu.addBuyingWeapon("Copper sword", 3, 15);
                menu.addBuyingDefenseItem("Copper shield", 2, 15);
                menu.addBuyingHealthPotion();
            break;
            case 2:
                menu.addBuyingWeapon("Iron sword", 4, 20);
                menu.addBuyingDefenseItem("Iron shield", 3, 20);
                menu.addBuyingHealthPotion();
            break;
            case 3:
                menu.addBuyingWeapon("Silver sword", 5, 30);
                menu.addBuyingDefenseItem("Silver shield", 4, 30);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 4:
                menu.addBuyingWeapon("Gold sword", 6, 40);
                menu.addBuyingDefenseItem("Gold shield", 5, 40);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 5:
                menu.addBuyingWeapon("Diamond sword", 7, 50);
                menu.addBuyingDefenseItem("Diamond shield", 6, 50);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 6:
                menu.addBuyingWeapon("Falchion", 8, 100);
                menu.addBuyingDefenseItem("Diamond shield", 6, 50);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 7:
                menu.addBuyingWeapon("Falchion", 8, 100);
                menu.addBuyingDefenseItem("Shield of El Cid", 8, 100);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 8:
                menu.addBuyingWeapon("Dagger of Time", 10, 180);
                menu.addBuyingDefenseItem("Shield of El Cid", 8, 100);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 9:
                menu.addBuyingWeapon("Dagger of Time", 10, 180);
                menu.addBuyingDefenseItem("Shield of Achilles", 10, 180);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 10:
                menu.addBuyingWeapon("Vorpal sword", 12, 250);
                menu.addBuyingDefenseItem("Shield of Achilles", 10, 180);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 11:
                menu.addBuyingWeapon("Vorpal sword", 12, 250);
                menu.addBuyingDefenseItem("Wynebgwrthucher", 12, 250);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 12:
                menu.addBuyingWeapon("Morgul-blade", 14, 400);
                menu.addBuyingDefenseItem("Wynebgwrthucher", 12, 250);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 13:
                menu.addBuyingWeapon("Morgul-blade", 14, 400);
                menu.addBuyingDefenseItem("Ancile", 14, 400);
                menu.addBuyingHealthPotion();
                menu.addBuyingHealthPendant();
            break;
            case 14:
                menu.addBuyingWeapon("Excalibur", 16, 600);
                menu.addBuyingDefenseItem("Ancile", 14, 400);
                menu.addBuyingSuperHealthPotion();
                menu.addBuyingHealthCrystal();
            break;
            case 15:
                menu.addBuyingWeapon("Excalibur", 16, 600);
                menu.addBuyingDefenseItem("Aegis", 16, 600);
                menu.addBuyingSuperHealthPotion();
                menu.addBuyingHealthCrystal();
            break;
            case 16:
                menu.addBuyingWeapon("Tonbogiri", 18, 1000);
                menu.addBuyingDefenseItem("Aegis", 16, 600);
                menu.addBuyingSuperHealthPotion();
                menu.addBuyingHealthCrystal();
            break;
            case 17: case 18: case 19:
                menu.addBuyingWeapon("Gungnir", 20, 1500);
                menu.addBuyingDefenseItem("Aegis", 16, 600);
                menu.addBuyingSuperHealthPotion();
                menu.addBuyingHealthCrystal();
            break;
            default:
                menu.addBuyingWeapon("Mjolnir", 30, 2000);
                menu.addBuyingDefenseItem("Aegis", 16, 600);
                menu.addBuyingSuperHealthPotion();
                menu.addBuyingHealthCrystal();
            break;
        }
        
        // Add the entry used to quit the shop
        menu.addQuitTheShop();
        
        // Set the menu
        this.menu = menu;
    }
    
    public pressedDownButton(): void{
        if(this.menu != null)
            this.menu.pressedDownButton();
    }
    
    public pressedSpaceButton(): void{
        if(this.step == SuperRPGStep.LOSE){
            this.shouldExitGame = true;
        }
        
        if(this.menu != null)
            this.menu.pressedSpaceButton();
    }
    
    public pressedUpButton(): void{
        if(this.menu != null)
            this.menu.pressedUpButton();
    }
    
    private runGame(): boolean{
        return false;
    }
    
    private runSplashScreen(): boolean{
        // If the timer is >= 0
        if(this.splashScreenTimer >= 0){
            // Reduce the timer
            this.splashScreenTimer -= 1;
        }
        // Else
        else{
            // Switch to the next step
            this.goToMainMenu();
        }
        
        // We can't end the game during the splash screen
        return false;
    }
}
