///<reference path="QuestEntity.ts"/>

class Devil extends QuestEntity{
    // Array containing the flames we can see when heating up the cauldron
    private flames: CauldronFlame[];
    
    // Minimum and maximum y position
    private minY: number;
    private maxY: number;
    
    // Are we going down or up?
    private goingDown: boolean;
    
    // Constructor
    constructor(quest: Quest, pos: Pos, minY: number, maxY: number){
        super(quest,
              pos,
              new Naming("The devil", "the devil"),
              new RenderArea(16, 16),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(4, 0), new Pos(8, 5))),
              new QuestEntityMovement()
             );
        
        // Set from parameters
        this.minY = minY;
        this.maxY = maxY;
        
        // At first we're going down
        this.setGoingDown(true);
        
        // Init the flames array
        this.flames = [];
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(false);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(666);
        this.setHp(666);
        
        // Set the transparent character and draw
        this.setTransparency(new RenderTransparency(" ", "%"));
        this.reDraw();
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Evilness", "evilness"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(18, 18))), 500));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setBetweenDelay(0, 5);
    }
    
    // inflictDamage()
    public inflictDamage(damage: number, reason: QuestEntityDamageReason): void{
        super.inflictDamage(Math.ceil(damage/4), reason);
    }
    
    // update()
    public update(): void{
        // Handle movement
        this.handleUpDownMovement();
        
        // Handle fireballs
        this.handleFireballs();
        
        // Handle the flames
        this.handleFlames();
        
        // Re draw the devil (ascii art + flames)
        this.reDraw();
        
        // Call the mother class update method
        super.update();
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(1000000), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "gridItemPossessedA", "You found a strange stone.", "You gain a strange stone."));
    }
    
    // Private methods
    private castFireball(): void{
        // Create the fireball
        var fireBall: Fireball = new Fireball(this.getQuest(),
                                              this.getGlobalPosition().plus(new Pos(3, 4)),
                                              new Naming("The devil's fireball", "the devil's fireball"),
                                              new Color(ColorType.DEVIL_FIREBALL),
                                              new Pos(2, 1),
                                              800,
                                              this.getAndPossiblyCreateSpellCastingDamageReason(new Naming("The devil's fireball", "the devil's fireball"))
                                             );
        
        // If the player is on our left
        if(this.getQuest().getGame().getPlayer().getGlobalPosition().x < this.getGlobalPosition().x){
            // No target
            fireBall.setTargetTypeNoTarget(new Pos(-Random.between(3, 7), 0));
        }
        // Else
        else{
            // We target the player
            fireBall.setTargetTypeTargetEntity(this.getQuest().getGame().getPlayer(), null, new Pos(1, 1));
        }
        
        // Add the entity
        this.getQuest().addEntity(fireBall);
    }
    
    private handleFireballs(): void{
        if(Random.oneChanceOutOf(2)) this.castFireball();
    }
    
    private handleFlames(): void{
        // Create the variables
        var minX: number = 0;
        var maxX: number = 15;
        var minY: number = 6;
        var maxY: number = 15;
        var howManyFlames: number = 150;
        var x: number;
        var y: number;
            
        // Add flames depending on the current timer time
        for(var i = 0; i < howManyFlames; i++){
            // If there is no flame for this index OR one chance out of 7
            if(i >= this.flames.length || Random.oneChanceOutOf(7)){
                // Set y
                y = null;
                for(var j = minY; j < maxY; j++){
                    if(Random.oneChanceOutOf(3)){
                        y = j;
                        break;
                    }
                }
                if(y == null) y = maxY;
                
                // Set x
                x = Random.between(minX + Math.floor((15-y)/3), maxX - Math.floor((15-y)/3));
                
                // Add or replace the flame
                var flame: CauldronFlame = new CauldronFlame(new Pos(x, y), Random.fromArray([")", "(", "`", "'", ".", ";", ":", ",", "-", "/", "\\", "|", "\"", "d", "e", "v", "i", "l"]));
                if(i >= this.flames.length) this.flames.push(flame);
                else this.flames[i] = flame;
            }
        }
    }
    
    private handleUpDownMovement(): void{
        // If we're going down but we're too low or it will be impossible, we now go up
        if(this.goingDown && (this.getGlobalPosition().y >= this.maxY || this.checkCollision(new Pos(0, 1)))){
            this.setGoingDown(false);
        }
        // Else, if we're going up but we're too high, we now go down
        else if(this.goingDown == false && (this.getGlobalPosition().y <= this.minY || this.checkCollision(new Pos(0, -1)))){
            this.setGoingDown(true);
        }
    }
    
    private reDraw(): void{
        // Reset everything
        this.getRenderArea().resetAllButSize();
        
        // Draw the ascii art
        this.getRenderArea().drawArray(Database.getAscii("places/quests/hell/devil"), 4, 0);
        
        // Draw the flames
        for(var i = 0; i < this.flames.length; i++){
            this.flames[i].draw(this.getRenderArea(), 0, 0);
        }
    }
    
    private setGoingDown(goingDown: boolean): void{
        this.goingDown = goingDown;
        
        if(this.goingDown){
            this.getQuestEntityMovement().setOffset(new Pos(0, 1));
        }
        else{
            this.getQuestEntityMovement().setOffset(new Pos(0, -1));
        }
    }
}