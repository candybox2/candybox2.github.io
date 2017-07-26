///<reference path="QuestEntity.ts"/>

// Register our hp
Saving.registerNumber("playerHp", 100);

class Player extends QuestEntity{
    // The game
    private game: Game;
    
    // Character type
    private characterType: PlayerCharacterType;
    
    // Constructor
    constructor(game: Game){
        super(null, new Pos(0, 0), new Naming("You", "you"));
        
        // Set the game
        this.game = game;
        
        // Set destructible
        this.setDestructible(true);
    }
    
    // Public methods
    public beginBerserk(duration: number): boolean{
        // Call the mother class method
        if(super.beginBerserk(duration)){
            // Update the render area
            this.drawOnRenderArea();
            // Return true
            return true;
        }
        
        // We didn't become a turtle : return false
        return false;
    }
    
    public beginTurtle(duration: number): boolean{
        // Call the mother class method
        if(super.beginTurtle(duration)){
            // Update the render area
            this.drawOnRenderArea();
            // Return true
            return true;
        }
        
        // We didn't become a turtle : return false
        return false;
    }
    
    public canJumpInMidAir(): boolean{
        // If we have the rocket boots, we can!
        if(this.game.isEquipped("boots", "eqItemBootsRocketBoots"))
            return true;
        
        return false;
    }
    
    public checkCollision(pos: Pos = new Pos(0, 0)): boolean{
        // If our mother class detects a collision, we return true
        if(super.checkCollision(pos) == true)
            return true;
        
        // We also try collisions with the special player collision boxes
        if(this.collidesWith(this.getQuest().getPlayerCollisionBoxes(), pos))
            return true;
        
        return false;
    }
    
    public getCharacterType(): PlayerCharacterType{
        return this.characterType;
    }
    
    public getClassicCollisionBoxCollection(): CollisionBoxCollection{
        switch(this.characterType){
            case PlayerCharacterType.CANDYBOX:
                return new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(5, 3)));
            break;
            case PlayerCharacterType.MEDIUM:
                return new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(13, 6)));
            break;
            case PlayerCharacterType.CANDYBOX_SQUEEZED:
                return new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(3, 3)));
            break;
            case PlayerCharacterType.MEDIUM_SQUEEZED:
                return new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(8, 5)));
            break;
        }
    }
    
    public getQuestEntityWeapon(quest: Quest = null): QuestEntityWeapon{
        var qew: QuestEntityWeapon;
        
        // If a weapon is equipped, we use the quest entity weapon it provides us
        if(this.game.getSelectedEqItems()["weapon"] != null){
            qew = this.game.getSelectedEqItems()["weapon"].getQuestEntityWeapon(quest, this);
        }
        // Else, no weapon is equipped, we use our fists
        else{
            qew = new QuestEntityWeapon(this.getQuest(), this, new Naming("Your fists", "your fists"), this.getClassicCollisionBoxCollection(), 1);
            qew.getCloseCombatDelay().setFixedDelay(6, 0);
        }
        
        return qew;
    }
    
    public getSpellCastingPosition(facingRight: boolean = true): Pos{
        switch(this.characterType){
            case PlayerCharacterType.CANDYBOX:
                if(facingRight) return this.getGlobalPosition().plus(new Pos(3, -1));
                else return this.getGlobalPosition().plus(new Pos(-1, -1));
            break;
            case PlayerCharacterType.MEDIUM:
                if(facingRight) return this.getGlobalPosition().plus(new Pos(11, 0));
                else return this.getGlobalPosition().plus(new Pos(-1, 0));
            break;
            case PlayerCharacterType.CANDYBOX_SQUEEZED:
                if(facingRight) return this.getGlobalPosition().plus(new Pos(0, -1));
                else return this.getGlobalPosition().plus(new Pos(0, -1));
            break;
            case PlayerCharacterType.MEDIUM_SQUEEZED:
                if(facingRight) return this.getGlobalPosition().plus(new Pos(6, 0));
                else return this.getGlobalPosition().plus(new Pos(-1, 0));
            break;
        }
    }
    
    public getThornsPositionsArray(): Pos[]{
        // Create the array
        var arr: Pos[];
        
        // Fill the array with different positons depending on the character type
        switch(this.characterType){
            case PlayerCharacterType.CANDYBOX: case PlayerCharacterType.CANDYBOX_SQUEEZED:
                arr = [new Pos(-6, 0),
                       new Pos(-4, -1),
                       new Pos(-2, -2),
                       new Pos(1, -2),
                       new Pos(3, -1),
                       new Pos(5, 0),
                       new Pos(3, 1),
                       new Pos(1, 2),
                       new Pos(-2, 2),
                       new Pos(-4, 1)
                     ];
            break;
            case PlayerCharacterType.MEDIUM: case PlayerCharacterType.MEDIUM_SQUEEZED:
                arr = [new Pos(11, -2),
                       new Pos(12, -1),
                       new Pos(13, 0),
                       new Pos(13, 1),
                       new Pos(13, 2),
                       new Pos(12, 3),
                       new Pos(11, 4)
                     ];
            break;
        }
        
        // Return the array
        return arr;
    }
    
    public hit(questEntity: QuestEntity, damage: number, reason: QuestEntityDamageReason): void{
        for(var savingName in this.game.getSelectedEqItems()){
            damage = this.game.getSelectedEqItems()[savingName].hit(this, this.getQuest(), questEntity, damage, reason);
        }
        
        for(var savingName in this.game.getGridItems()){
            if(Saving.loadBool(savingName)) damage = this.game.getGridItems()[savingName].hit(this, this.getQuest(), questEntity, damage, reason);
        }
        
        // Gift of power
        if(Saving.loadNumber("gameGiftPower") > 0){
            damage = Math.ceil(damage + damage * (Saving.loadNumber("gameGiftPower")/5));
        }
        
        super.hit(questEntity, damage, reason);
    }
    
    public inflictDamage(damage: number, reason: QuestEntityDamageReason): void{
        for(var savingName in this.game.getSelectedEqItems()){
            damage = this.game.getSelectedEqItems()[savingName].inflictDamage(this, this.getQuest(), damage, reason);
        }

        super.inflictDamage(damage, reason);
    }
    
    public load(): void{
        this.setHp(Saving.loadNumber("playerHp"));
    }
    
    public loadCandyBoxCharacter(quest: Quest, firstTime: boolean = true): void{
        // Set the type
        this.characterType = PlayerCharacterType.CANDYBOX;
        
        // Load stuff common to all characters if it's the first time we load the character in this quest
        if(firstTime) this.loadCharacter(quest);
        
        // Set the ascii representation (size + what it looks like)
        this.setRenderArea(new RenderArea(3, 1));
        this.drawOnRenderArea();

        // Set the collision boxes
        this.setCbc(new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(3, 1))));
        
        // Transparency
        this.setTransparency(null);
    }
    
    public loadCandyBoxSqueezedCharacter(quest: Quest, firstTime: boolean = true): void{
        // Set the type
        this.characterType = PlayerCharacterType.CANDYBOX_SQUEEZED;
        
        // Load stuff common to all characters if it's the first time we load the character in this quest
        if(firstTime) this.loadCharacter(quest);
        
        // Set the ascii representation (size + what it looks like)
        this.setRenderArea(new RenderArea(1, 1));
        this.drawOnRenderArea();

        // Set the collision boxes
        this.setCbc(new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(1, 1))));
        
        // Transparency
        this.setTransparency(null);
    }
    
    public loadCharacter(quest: Quest): void{
        // Set the quest
        this.setQuest(quest);
        
        // Add the quest entity weapon
        this.addQuestEntityWeapon(this.getQuestEntityWeapon(this.getQuest()));
            
        // Set the team
        this.setTeam(QuestEntityTeam.PLAYER);
    }
    
    public loadMediumCharacter(quest: Quest, firstTime: boolean = true): void{
        // Set the type
        this.characterType = PlayerCharacterType.MEDIUM;
        
        // Load stuff common to all characters if it's the first time we load the character in this quest
        if(firstTime) this.loadCharacter(quest);
        
        // Set the ascii representation (size + what it looks like)
        this.setRenderArea(new RenderArea(11, 4));
        this.drawOnRenderArea();

        // Set the collision boxes
        this.setCbc(new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(11, 1)),
                                               new CollisionBox(this, new Pos(1, 1), new Pos(9, 1)),
                                               new CollisionBox(this, new Pos(2, 2), new Pos(7, 1)),
                                               new CollisionBox(this, new Pos(4, 3), new Pos(3, 1))
                                              ));
        
        // Transparent character
        this.setTransparency(new RenderTransparency(" ", "%"));
    }
    
    public loadMediumSqueezedCharacter(quest: Quest, firstTime: boolean = true): void{
        // Set the type
        this.characterType = PlayerCharacterType.MEDIUM_SQUEEZED;
        
        // Load stuff common to all characters if it's the first time we load the character in this quest
        if(firstTime) this.loadCharacter(quest);
        
        // Set the ascii representation (size + what it looks like)
        this.setRenderArea(new RenderArea(6, 3));
        this.drawOnRenderArea();

        // Set the collision boxes
        this.setCbc(new CollisionBoxCollection(new CollisionBox(this, new Pos(2, 0), new Pos(2, 1)),
                                               new CollisionBox(this, new Pos(0, 1), new Pos(6, 1)),
                                               new CollisionBox(this, new Pos(2, 2), new Pos(2, 1))
                                              ));
        
        // Transparent character
        this.setTransparency(new RenderTransparency(" ", "%"));
    }
    
    public magicHealthRegain(): void{
        // If we're not questing
        if(this.game.getWeAreQuesting() == false){
            var hpBonus: number = Math.ceil((1-Math.exp(-this.game.getCandiesEaten().getCurrent()/400000000))*500);
            if(hpBonus < 1) hpBonus = 1; // We need to gain at least one hp each second
            this.setHp(this.getHp() + hpBonus);
        }
    }
    
    public move(pos: Pos, force: boolean = false): boolean{
        // Position
        var posToUse: Pos = pos.copy();
        
        // If we are wearing the boots of introspection and we would collide by going below, we don't move horizontally and the movement isn't forced
        if(posToUse.x != 0 && this.game.isEquipped("boots", "eqItemBootsBootsOfIntrospection") && this.checkCollision(new Pos(0, 1)) == true && force == false)
            posToUse.x = 0;
        
        return super.move(posToUse, force);
    }
    
    public moveWormsLike(pos: Pos): boolean{
        // Position
        var posToUse: Pos = pos.copy();
        
        // If we are wearing the boots of introspection and we would collide by going below, we don't move horizontally
        if(posToUse.x != 0 && this.game.isEquipped("boots", "eqItemBootsBootsOfIntrospection") && this.checkCollision(new Pos(0, 1)) == true)
            posToUse.x = 0;
        
        return super.moveWormsLike(posToUse);
    }
    
    public reCalcMaxHp(): void{
        // Base maximum hp : 100
        var maxHp: number = 100;
        
        // We add to the base, depending on how much candies eaten, if we're not playing in hard mode
        if(Saving.loadString("gameGameMode") != "hard"){
            maxHp += Math.ceil((1-Math.exp(-this.game.getCandiesEaten().getCurrent()/3000))*100) + Math.ceil((1-Math.exp(-this.game.getCandiesEaten().getCurrent()/400000))*800);
        }
        
        // We add 300 if we have the heart pendant
        if(Saving.loadBool("gridItemPossessedHeartPendant"))
            maxHp += 300;
        
        // We add 20% if we have the heart plug
        if(Saving.loadBool("gridItemPossessedHeartPlug"))
            maxHp = Math.ceil(maxHp * 1.2);
        
        // Health gift
        if(Saving.loadNumber("gameGiftHealth") > 0){
            maxHp = maxHp + maxHp * (Saving.loadNumber("gameGiftHealth")/5);
        }
        
        // We finally set the value we calculated
        this.setMaxHp(maxHp);
        
        // We update the status bar
        this.game.updateStatusBar();
    }
    
    public save(): void{
        Saving.saveNumber("playerHp", this.getHp());
    }
    
    public shouldDie(): boolean{
        // We use the method of our mother class PLUS we're also dead if out of area
        if(super.shouldDie() || this.getOutOfArea())
            return true;
        
        return false;
    }
    
    public squeeze(): void{
        // Do different things depending on the current character type
        switch(this.characterType){
            case PlayerCharacterType.CANDYBOX:
                // We squeeze
                this.loadCandyBoxSqueezedCharacter(this.getQuest(), false);
                this.move(new Pos(1, 0), true);
                // We add a message to the log
                this.game.getQuestLog().addMessage(new QuestLogMessage("You squeezed!"));
            break;
            case PlayerCharacterType.MEDIUM:
                // We squeeze
                this.loadMediumSqueezedCharacter(this.getQuest(), false);
                this.move(new Pos(2, 1), true);
                // We add a message to the log
                this.game.getQuestLog().addMessage(new QuestLogMessage("You squeezed!"));
            break;
            case PlayerCharacterType.CANDYBOX_SQUEEZED:
                // We unsqueeze
                this.loadCandyBoxCharacter(this.getQuest(), false);
                this.move(new Pos(-1, 0), true);
                // If there's a collision
                if(this.checkCollision()){
                    // We squeeze again
                    this.loadCandyBoxSqueezedCharacter(this.getQuest(), false);
                    this.move(new Pos(1, 0), true);
                    // We add a message to the log
                    this.game.getQuestLog().addMessage(new QuestLogMessage("You can't unsqueeze because there isn't enough space."));
                }
                else{
                    // We add a message to the log
                    this.game.getQuestLog().addMessage(new QuestLogMessage("You unsqueezed!"));
                }
            break;
            case PlayerCharacterType.MEDIUM_SQUEEZED:
                // We unsqueeze
                this.loadMediumCharacter(this.getQuest(), false);
                this.move(new Pos(-2, -1), true);
                // If there's a collision
                if(this.checkCollision()){
                    // We squeeze again
                    this.loadMediumSqueezedCharacter(this.getQuest(), false);
                    this.move(new Pos(2, 1), true);
                    // We add a message to the log
                    this.game.getQuestLog().addMessage(new QuestLogMessage("You can't unsqueeze because there isn't enough space."));
                }
                else{
                    // We add a message to the log
                    this.game.getQuestLog().addMessage(new QuestLogMessage("You unsqueezed!"));
                }
            break;
        }
    }
    
    public stopBerserk(): void{
        // Mother class method
        super.stopBerserk();
        
        // Update the render area
        this.drawOnRenderArea();
    }
    
    public stopTurtle(): void{
        // Mother class method
        super.stopTurtle();
        
        // Update the render area
        this.drawOnRenderArea();
    }
    
    public update(): void{
        for(var savingName in this.game.getSelectedEqItems()){
            this.game.getSelectedEqItems()[savingName].update(this, this.getQuest());
        }
        
        for(var savingName in this.game.getGridItems()){
            if(Saving.loadBool(savingName)) this.game.getGridItems()[savingName].update(this, this.getQuest());
        }
        
        super.update();
    }

    // Public setters : they must be public, because sometimes we have to set these things (at loading for example)
    public setHp(hp: number): void{
        super.setHp(hp);
        this.game.updateStatusBar();
    }
    
    public setMaxHp(hp: number): void{
        super.setMaxHp(hp);
        this.game.updateStatusBar();
    }
    
    // Private methods
    private drawOnRenderArea(): void{
        // Erase the render area
        this.getRenderArea().resetAllButSize();
        
        // Draw depending on the type
        switch(this.characterType){
            case PlayerCharacterType.CANDYBOX:
                if(this.getTurtle() && this.getBerserk())
                    this.getRenderArea().drawString("TUR");
                else if(this.getTurtle())
                    this.getRenderArea().drawString("tur");
                else if(this.getBerserk())
                    this.getRenderArea().drawString("O_O");
                else
                    this.getRenderArea().drawString("\\o/");
            break;
            case PlayerCharacterType.CANDYBOX_SQUEEZED:
                if(this.getTurtle() && this.getBerserk())
                    this.getRenderArea().drawString("T");
                else if(this.getTurtle())
                    this.getRenderArea().drawString("t");
                else if(this.getBerserk())
                    this.getRenderArea().drawString("B");
                else
                    this.getRenderArea().drawString("o");
                
            break;
            case PlayerCharacterType.MEDIUM:
                if(this.getTurtle() && this.getBerserk())
                    this.getRenderArea().drawArray(Database.getAscii("players/mediumTurtleBerserk"));
                else if(this.getTurtle())
                    this.getRenderArea().drawArray(Database.getAscii("players/mediumTurtle"));
                else if(this.getBerserk())
                    this.getRenderArea().drawArray(Database.getAscii("players/mediumBerserk"));
                else
                    this.getRenderArea().drawArray(Database.getAscii("players/medium"));
            break;
            case PlayerCharacterType.MEDIUM_SQUEEZED:
                if(this.getTurtle() && this.getBerserk())
                    this.getRenderArea().drawArray(Database.getAscii("players/mediumSqueezedTurtleBerserk"));
                else if(this.getTurtle())
                    this.getRenderArea().drawArray(Database.getAscii("players/mediumSqueezedTurtle"));
                else if(this.getBerserk())
                    this.getRenderArea().drawArray(Database.getAscii("players/mediumSqueezedBerserk"));
                else
                    this.getRenderArea().drawArray(Database.getAscii("players/mediumSqueezed"));
            break;
        }
    }
}
