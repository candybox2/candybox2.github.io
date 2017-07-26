class QuestEntity{
    // The quest
    private quest: Quest;
    
    // Is dead ?
    private dead: boolean = false;
    
    // Is out of area ?
    private outOfArea: boolean = false;
    
    // Is destructible ?
    private destructible: boolean = false;
        // Health
        private hp: number;
        private maxHp: number;
        
    // Should the health bar be shown ?
    private healthBar: QuestEntityHealthBar = null;

    // Global position
    private globalPosition: Pos;
    
    // Ascii representation
    private renderAreaPosition: Pos;
    private renderArea: RenderArea;
    private transparency: RenderTransparency = null;
    
    // Collision box collection
    private cbc: CollisionBoxCollection;
    
    // Movement
    private questEntityMovement: QuestEntityMovement;
    private noMovementLastUpdate: boolean = true;
    
    // Animation
    private questEntityAnimation: QuestEntityAnimation;
    
    // Weapon
    private questEntityWeapons: QuestEntityWeapon[] = [];
    
    // Spell casters
    private questEntitySpellCasters: QuestEntitySpellCaster[] = [];
    
    // Last damage reason
    private lastDamageReason: QuestEntityDamageReason = null;
    
    // Naming
    private naming: Naming = null;
    
    // Team
    private team: QuestEntityTeam = QuestEntityTeam.MOBS; // The default team of an entity is MOBS because most entities want to use this one
    
    // Can it be forced to move?
    private canBeForcedToMove: boolean = true;
    
    // The special spell casting damage reason, null until we create it
    private spellCastingDamageReason: QuestEntityDamageReason = null;
    
    // Is a spell?
    private isASpell: boolean = false;
    
    // Is jumping?
    private jumping: boolean = false;
    private jumpSpeed: number = null;
    private jumpDuration: number = null;
    
    // Is controlled falling? (controlled falling is when we fall after a jump for example, it means that we can move while falling)
    private controlledFalling = false;
    
    // Is stopped?
    private stopped: boolean = false;
    private stoppedDuration: number = null;
    
    // Is affected by anti gravity?
    private antiGravity: boolean = false;
    private antiGravityDuration: number = null;
    
    // Is a turtle?
    private turtle: boolean = false;
    private turtleDuration: number = null;
    private turtleLastMovement: number = null;
    
    // Is in berserk mode?
    private berserk: boolean = false;
    private berserkDuration: number = null;
    
    // Constructor
    constructor(quest: Quest,
                globalPosition: Pos,
                naming: Naming = new Naming("???", "???"),
                renderArea: RenderArea = null,
                renderAreaPosition: Pos = new Pos(0, 0),
                cbc: CollisionBoxCollection = null,
                questEntityMovement: QuestEntityMovement = null,
                questEntityAnimation: QuestEntityAnimation = null
               ){
        // Apply parameters
        this.quest = quest;
        this.globalPosition = globalPosition;
        this.naming = naming;
        this.setRenderArea(renderArea);
        this.renderAreaPosition = renderAreaPosition;
        this.setCbc(cbc);
        this.setQuestEntityMovement(questEntityMovement);
        this.setQuestEntityAnimation(questEntityAnimation);
    }
    
    // Public methods
    public addQuestEntitySpellCaster(questEntitySpellCaster: QuestEntitySpellCaster): void{
        this.questEntitySpellCasters.push(questEntitySpellCaster);
    }
    
    public addQuestEntityWeapon(questEntityWeapon: QuestEntityWeapon): void{
        this.questEntityWeapons.push(questEntityWeapon);
    }
    
    public beginAntiGravity(antiGravityDuration: number): boolean{
        if(this.antiGravity == false){
            this.antiGravity = true;
            this.antiGravityDuration = antiGravityDuration;
            return true;
        }
        
        return false;
    }
    
    public beginBerserk(berserkDuration: number): boolean{
        if(this.berserk == false){
            this.berserk = true;
            this.berserkDuration = berserkDuration;
            this.setHp(Math.ceil(this.getHp()/2));
            return true;
        }
        
        return false;
    }
    
    public beginTurtle(turtleDuration: number): boolean{
        if(this.turtle == false){
            this.turtle = true;
            this.turtleDuration = turtleDuration;
            this.turtleLastMovement = 0;
            return true;
        }
        
        return false;
    }
    
    public canJumpInMidAir(): boolean{
        return false;
    }
    
    public checkCollision(pos: Pos = new Pos(0, 0)): boolean{
        // BUGS : if the level is >= 4, we just return a random value
        if(Bugs.getQuestBugLevel() >= 4)
            return Random.flipACoin();
        
        for(var i = 0; i < this.quest.getEntities().length; i++){
            // If it's not the same object as us
            if(this.quest.getEntities()[i] != this){
                // If we collide with it, we return true
                if(this.collidesWith(this.quest.getEntities()[i], pos))
                    return true;
            }
        }
        
        // No collision
        return false;
    }
    
    public collidesWith(questEntity: QuestEntity, pos: Pos = new Pos(0, 0)): boolean{
        // If we both have a collision box collection, we return the result of the collision test
        if(this.cbc != null && questEntity.getCbc() != null)
           return this.cbc.collidesWith(questEntity.getCbc(), pos);
        
        // Else, we return false, there can't be any collision
        return false;
    }
    
    public draw(renderArea: RenderArea): void{
        if(this.renderArea != null){
            // On some conditions, we exit now and don't draw anything (it allows no drawing outside of the quest panel when realQuestSize and realQuestDrawingSize are different (in the hole for example)
            if(this.globalPosition.x + this.renderAreaPosition.x + this.quest.getGlobalDrawingOffset().x > this.quest.getRealQuestDrawingSize().x)
                return;
            if(this.globalPosition.y + this.renderAreaPosition.y + this.quest.getGlobalDrawingOffset().y > this.quest.getRealQuestDrawingSize().y)
                return;
            if(this.globalPosition.x + this.renderAreaPosition.x + this.renderArea.getWidth() + this.quest.getGlobalDrawingOffset().x < 0)
                return;
            if(this.globalPosition.y + this.renderAreaPosition.y + this.renderArea.getHeight() + this.quest.getGlobalDrawingOffset().y < 0)
                return;
                
            renderArea.drawArea(this.renderArea, this.quest.getRealQuestPosition().x + this.quest.getGlobalDrawingOffset().x + this.globalPosition.x + this.renderAreaPosition.x, this.quest.getRealQuestPosition().y + this.quest.getGlobalDrawingOffset().y + this.globalPosition.y + this.renderAreaPosition.y, this.transparency);
        }
            
        // If the debug mode is on
        if(Saving.loadBool("gameDebug")){
            if(this.cbc != null){
                for(var i = 0; i < this.cbc.getBoxes().length; i++){
                    for(var k = 0; k < this.cbc.getBoxes()[i].getSize().x; k++){
                        for(var j = 0; j < this.cbc.getBoxes()[i].getSize().y; j++){
                            renderArea.drawString("D", this.quest.getRealQuestPosition().x + this.quest.getGlobalDrawingOffset().x + this.globalPosition.x + this.cbc.getBoxes()[i].getPosition().x + k, this.quest.getRealQuestPosition().y + this.quest.getGlobalDrawingOffset().y + this.globalPosition.y + this.cbc.getBoxes()[i].getPosition().y + j);
                        }
                    }
                }
            }
        }
    }
    
    public forceMoving(movement: Pos): void{
        if(this.canBeForcedToMove)
            this.move(movement, true);
    }
    
    public getAndPossiblyCreateSpellCastingDamageReason(naming: Naming): QuestEntityDamageReason{
        // If our spell casting damage reason is null, we create it
        if(this.spellCastingDamageReason == null){
            this.spellCastingDamageReason = new QuestEntityDamageReason(QuestEntityDamageReasonWhoType.ENTITY, QuestEntityDamageReasonWhatType.SPELL);
            this.spellCastingDamageReason.setQuestEntity(this);
        }
        
        // We set the naming given
        this.spellCastingDamageReason.setSpellNaming(naming);
        
        // We return it
        return this.spellCastingDamageReason;
    }
    
    public getDeathMessage(): string{
        // If there's a last damage reason
        if(this.getLastDamageReason() != null){
            return this.getLastDamageReason().getWhoNaming().getBeginning() + " killed " + this.naming.getAnywhere() + " with " + this.getLastDamageReason().getWhatNaming().getAnywhere() + ".";
        }
        
        // Else
        return this.naming.getBeginning() + " was erased from reality.";
    }
    
    public getRenderAreaCenter(): Pos{
        if(this.renderArea != null)
            return this.globalPosition.plus(new Pos(Math.floor(this.renderArea.getWidth()/2), Math.floor(this.renderArea.getHeight()/2)))
        return this.globalPosition;
    }
    
    public goTowards(ourPosition: Pos, goalPosition: Pos, minDistance: number = 0, speed: Pos = new Pos(1, 1), dontTakeYInAccount: boolean = false): void{
        // We create the movement
        var movement: Pos = new Pos(0, 0);
        
        // We find the distance between our position and the position where we want to go
        var distance: Pos = ourPosition.getDistance(goalPosition);
        
        // If the x distance is the biggest (we do /2 because characters are thin in the ascii art world!) and big enough (or if we don't take in account y)
        if((Math.abs(distance.x)/2 > Math.abs(distance.y) && Math.abs(distance.x) > minDistance*2) || dontTakeYInAccount){
            if(distance.x > 0) movement.x = -speed.x;
            else if(distance.x < 0) movement.x = speed.x;
        }
        // Else, the y distance is the biggest and big enough
        else if(Math.abs(distance.y) > minDistance){
            if(distance.y > 0) movement.y = -speed.y;
            else if(distance.y < 0) movement.y = speed.y;
        }
        
        // We use this movement to set our quest entity movement's offset
        this.getQuestEntityMovement().setOffset(movement);
    }
    
    public heal(hp: number): void{
        this.setHp(this.getHp() + hp);
    }
    
    public hit(questEntity: QuestEntity, damage: number, reason: QuestEntityDamageReason): void{
        // BUGS
        if(Bugs.getQuestBugLevel() >= 1)
            damage *= Random.between(1, 3);
        
        if(this.berserk == false)
            questEntity.inflictDamage(damage, reason);
        else
            questEntity.inflictDamage(damage*2, reason);
    }
    
    public inflictDamage(damage: number, reason: QuestEntityDamageReason): void{
        // We save the damage reason
        this.lastDamageReason = reason;
        
        // If we're destructible, we get the damage
        if(this.destructible){
            // If we're not a turtle
            if(this.turtle == false)
                this.setHp(this.getHp()-damage);
            // Else, we're a turtle
            else
                this.setHp(this.getHp()-Math.ceil(damage/2));
        }
    }
    
    public isOutOfArea(): boolean{
        // If the entity if too much out of the area, we return true
        if(this.globalPosition.x < -this.getQuest().getLeftLimit())
            return true;
        if(this.globalPosition.y < -this.getQuest().getTopLimit())
            return true;
        if(this.globalPosition.x > this.quest.getRealQuestSize().x + this.getQuest().getRightLimit())
            return true;
        if(this.globalPosition.y > this.quest.getRealQuestSize().y + this.getQuest().getBottomLimit())
            return true;
        
        // Else we return false
        return false;
    }
    
    public jump(jumpDuration: number, jumpSpeed: number = 1): boolean{
        // BUGS
        if(Bugs.getQuestBugLevel() >= 2)
            jumpSpeed = Random.between(1, 5);
        
        // If we're not already jumping or controlled falling and we would collide by going down (which means we're on the ground), we jump (we also jump without checking all that if we are able to jump in mid-air)
        if((this.jumping == false && this.controlledFalling == false && this.checkCollision(new Pos(0, 1))) || this.canJumpInMidAir()){
            this.jumping = true;
            this.jumpDuration = jumpDuration;
            this.jumpSpeed = jumpSpeed;
            return true;
        }
        
        return false;
    }
    
    public move(pos: Pos, force: boolean = false): boolean{
        // BUGS
        if(Bugs.getQuestBugLevel() >= 3 || (Bugs.getQuestBugLevel() >= 2 && Random.oneChanceOutOf(3)) || (Bugs.getQuestBugLevel() >= 1 && Random.oneChanceOutOf(5))){
            pos.x += Random.between(1, 3) - 2;
            pos.y += Random.between(1, 3) - 2;
        }
        
        // If we're not a turtle or this isn't a pure horizontal movement (turtles only care about horizontal movement)
        if(this.turtle == false || pos.y != 0)
            return this.setGlobalPosition(this.globalPosition.plus(pos), force);
        // Else, we're a turtle
        else{
            // We check the duration
            if(this.turtleDuration > 0){
                this.turtleDuration -= 1;
            }
            else this.stopTurtle();
            // If the movement is >= 2
            if(this.turtleLastMovement >= 2){
                this.turtleLastMovement = 0; // We reset the movement
                return this.setGlobalPosition(this.globalPosition.plus(pos), force); // We move
            }
            // Else, we increase the movement
            else{
                this.turtleLastMovement += 1;
                return false;
            }
        }
    }
    
    public moveWormsLike(pos: Pos): boolean{
        // If we can move normally
        if(this.checkCollision(pos) == false){
            // If we can't move two steps below but we can move on step below, then we move one step below (if we're not jumping or controlled falling)
            if(this.checkCollision(pos.plus(new Pos(0, 2))) == true && this.checkCollision(pos.plus(new Pos(0, 1))) == false && this.jumping == false && this.controlledFalling == false){
                return this.move(pos.plus(new Pos(0, 1)));
            }
            // Else we just move normally
            else{
                return this.move(pos);
            }
        }
        // Else, if we can move just one step above (and we're not jumping or controlled falling)
        else if(this.checkCollision(pos.plus(new Pos(0, -1))) == false && this.jumping == false && this.controlledFalling == false){
            // We move one step above
            return this.move(pos.plus(new Pos(0, -1)));
        }
        
        // Else we don't move
        return false;
    }
    
    public removeQuestEntityWeapons(): void{
        this.questEntityWeapons = [];
    }
    
    public setGlobalPosition(pos: Pos, force: boolean = false): boolean{
        var oldPosition: Pos = this.globalPosition;
        
        this.globalPosition = pos;
        
        // Check for collisions : restore the old position and return false if the movement would cause a collision
        if(force == false && this.checkCollision()){
            this.globalPosition = oldPosition;
            return false;
        }
        
        // Return true
        return true;
    }
    
    public shouldDie(): boolean{
        // Return true if we are destructible and have 0 hp or we're already dead
        if((this.destructible == true && this.hp <= 0) || this.dead == true)
            return true;
        
        return false;
    }
    
    public stop(stoppedDuration: number): boolean{
        // If we're not already stopped
        if(this.stopped == false){
            this.stopped = true;
            this.stoppedDuration = stoppedDuration;
            return true;
        }
        
        return false;
    }
    
    public stopBerserk(): void{
        this.berserk = false;
    }
    
    public stopTurtle(): void{
        this.turtle = false;
    }
    
    public teleport(pos: Pos): boolean{
        return this.setGlobalPosition(pos);
    }
    
    public testNewGlobalPosition(pos: Pos): boolean{
        var oldPosition: Pos = this.globalPosition;
        
        this.globalPosition = pos;
        
        // If there's a collision, restore the old position and return false
        if(this.checkCollision()){
            this.globalPosition = oldPosition;
            return false;
        }
        // Else, restore the old position and return true
        this.globalPosition = oldPosition;
        return true;
    }
    
    public update(): void{
        // We handle berserk mode
        if(this.berserk){
            if(this.berserkDuration > 0){
                this.berserkDuration -= 1;
            }
            else{
                this.stopBerserk();
            }
        }
        
        // We handle animation
        this.handleAnimation();
        
        // We handle gravity, and then movement if gravity had no effect
        this.noMovementLastUpdate = true;
        if(this.handleGravity() == false)
            this.handleMovement();
        
        // We handle combat
        this.handleCombat();
    }
    
    // Default behaviour of this function : displaying a simple death message in the quest log
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage()));
    }
    
    // Public getters
    public getBerserk(): boolean{
        return this.berserk;
    }
    
    public getCbc(): CollisionBoxCollection{
        return this.cbc;
    }
    
    public getDead(): boolean{
        return this.dead;
    }
    
    public getDestructible(): boolean{
        return this.destructible;
    }
    
    public getGlobalPosition(): Pos{
        return this.globalPosition;
    }
    
    public getHealthBar(): QuestEntityHealthBar{
        return this.healthBar;
    }
    
    public getHp(): number{
        return this.hp;
    }
    
    public getIsASpell(): boolean{
        return this.isASpell;
    }
    
    public getJumping(): boolean{
        return this.jumping;
    }
    
    public getLastDamageReason(): QuestEntityDamageReason{
        return this.lastDamageReason;
    }
    
    public getLastQuestEntitySpellCaster(): QuestEntitySpellCaster{
        return this.questEntitySpellCasters[this.questEntitySpellCasters.length-1];
    }
    
    public getLastQuestEntityWeapon(): QuestEntityWeapon{
        return this.questEntityWeapons[this.questEntityWeapons.length-1];
    }
    
    public getMaxHp(): number{
        return this.maxHp;
    }
    
    public getNaming(): Naming{
        return this.naming;
    }
    
    public getNoMovementLastUpdate(): boolean{
        return this.noMovementLastUpdate;
    }
    
    public getOutOfArea(): boolean{
        return this.outOfArea;
    }
    
    public getQuest(): Quest{
        return this.quest;
    }
    
    public getQuestEntityAnimation(): QuestEntityAnimation{
        return this.questEntityAnimation;
    }
    
    public getQuestEntityMovement(): QuestEntityMovement{
        return this.questEntityMovement;
    }
    
    public getQuestEntityWeapons(): QuestEntityWeapon[]{
        return this.questEntityWeapons;
    }
    
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    public getRenderAreaPosition(): Pos{
        return this.renderAreaPosition;
    }
    
    public getTeam(): QuestEntityTeam{
        return this.team;
    }
    
    public getTurtle(): boolean{
        return this.turtle;
    }
    
    // Public setters
    public setCanBeForcedToMove(canBeForcedToMove: boolean): void{
        this.canBeForcedToMove = canBeForcedToMove;
    }
    
    public setCbc(cbc: CollisionBoxCollection): void{
        this.cbc = cbc;
    }
    
    public setDead(dead: boolean): void{
        this.dead = dead;
    }
    
    public setDestructible(value: boolean): void{
        this.destructible = value;
    }
    
    public setHealthBar(healthBar: QuestEntityHealthBar): void{
        this.healthBar = healthBar;
    }
    
    public setHp(hp: number): void{
        // BUGS
        if(Bugs.getQuestBugLevel() >= 2)
            hp *= Random.between(1, 5);
        
        this.hp = hp;
        if(this.hp > this.maxHp) this.hp = this.maxHp;
        if(this.hp < 0) this.hp = 0;
        this.tryToUpdateHealthBar();
    }
    
    public setIsASpell(isASpell: boolean): void{
        this.isASpell = isASpell;
    }
    
    public setMaxHp(maxHp: number): void{
        // BUGS
        if(Bugs.getQuestBugLevel() >= 4)
            maxHp *= Random.between(1, 5);
        
        this.maxHp = maxHp;
        this.tryToUpdateHealthBar();
    }
    
    public setOutOfArea(outOfArea: boolean): void{
        this.outOfArea = outOfArea;
    }
    
    public setQuest(quest: Quest): void{
        this.quest = quest;
    }
    
    public setQuestEntityAnimation(questEntityAnimation: QuestEntityAnimation): void{
        // We set the animation
        this.questEntityAnimation = questEntityAnimation;
        
        // We update for the first time if not null
        if(this.questEntityAnimation != null) this.questEntityAnimation.draw(this.renderArea);
    }
    
    public setQuestEntityMovement(questEntityMovement: QuestEntityMovement): void{
        this.questEntityMovement = questEntityMovement;
    }
    
    public setRenderArea(renderArea: RenderArea): void{
        this.renderArea = renderArea;
    }
    
    public setTeam(questEntityTeam: QuestEntityTeam): void{
        this.team = questEntityTeam;
    }
    
    public setTransparency(transparency: RenderTransparency): void{
        this.transparency = transparency;
    }
    
    // Private methods
    private handleAnimation(): void{
        if(this.questEntityAnimation != null){
            this.questEntityAnimation.update();
            if(this.questEntityAnimation.shouldUpdateRenderAreaAtThisFrame()){
                this.renderArea.resetAllButSize();
                this.questEntityAnimation.draw(this.renderArea);
            }
        }
    }
    
    private handleCombat(): void{
        // We iterate over weapons and use them
        for(var i = 0; i < this.questEntityWeapons.length; i++){
            this.questEntityWeapons[i].handleCombat();
        }
        
        // We iterate over spellc asters and use them
        for(var i = 0; i < this.questEntitySpellCasters.length; i++){
            this.questEntitySpellCasters[i].tryToCast();
        }
    }
    
    private handleGravity(): boolean{
        // If we're jumping, we handle jumping
        if(this.jumping == true){
            // Decrease the jump duration
            this.jumpDuration -= 1;
            
            // If this is the last jumping frame, we stop jumping and don't jump at this frame
            if(this.jumpDuration <= 0){
                this.jumping = false;
                this.controlledFalling = true;
            }
            // Else, we try to jump
            else{
                // If we don't manage to jump, stop jumping
                if(this.move(new Pos(0, -this.jumpSpeed)) == false){
                    this.jumping = false;
                    this.controlledFalling = true;
                }
            }
            
            // Return false so that we can move while jumping
            return false;
        }
        // Else, we try to handle gravity
        else{
            // If we're not affected by anti-gravity and gravity isn't disabled in the whole quest
            if(this.antiGravity == false && this.getQuest().getGravityDisabled() == false){
                if(this.questEntityMovement != null && this.questEntityMovement.getGravity()){
                    if(this.move(new Pos(0, 1))){
                        if(this.controlledFalling == false) return true; // If we weren't controlling our falling, then we return true because we can't move
                    }
                    else this.controlledFalling = false; // If we hit the ground above, no mroe controlled falling
                }
            }
            else{
                this.antiGravityDuration -= 1;
                if(this.antiGravityDuration <= 0) this.antiGravity = false;
            }
        }
        
        // Gravity had no effect
        return false;
    }
    
    private handleMovement(): void{
        // If we're not stopped
        if(this.stopped == false){
            if(this.questEntityMovement != null){
                this.questEntityMovement.update();
                if(this.questEntityMovement.shouldMoveAtThisFrame()){
                    // If worms like movement is activated and we're not under anti-gravity and worms like movement isn't disabled by the quest
                    if(this.questEntityMovement.getWormsLike() && this.antiGravity == false && this.getQuest().getWormsLikeDisabled() == false){
                        if(this.moveWormsLike(this.questEntityMovement.getCurrentFrameMovement()))
                            this.noMovementLastUpdate = false;
                    }
                    // Else, we just try to move
                    else{
                        if(this.move(this.questEntityMovement.getCurrentFrameMovement()))
                            this.noMovementLastUpdate = false;
                    }
                }
            }
        }
        else{
            this.stoppedDuration -= 1;
            if(this.stoppedDuration <= 0)
                this.stopped = false;
        }
    }
    
    private tryToUpdateHealthBar(): void{
        // Update our health bar if we have one
        if(this.healthBar != null)
            this.healthBar.update();
    }
}
