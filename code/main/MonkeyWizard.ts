///<reference path="QuestEntity.ts"/>

class MonkeyWizard extends QuestEntity{
    // Timer used for spell casting
    private timer: number;
    
    // Timer used to decide when the spells stored on the roof will go down
    private bigTimer: number;
    
    // Are we going left or right? (left by default)
    private goingLeft: boolean;
    
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A monkey wizard", "a monkey wizard"),
              new RenderArea(4, 4),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(3, 0), new Pos(1, 1)),
                                         new CollisionBox(this, new Pos(1, 1), new Pos(3, 1)),
                                         new CollisionBox(this, new Pos(0, 2), new Pos(4, 1)),
                                         new CollisionBox(this, new Pos(0, 3), new Pos(4, 1))
                                        ),
              new QuestEntityMovement()
             );
        
        // Set the timers
        this.timer = 0;
        this.bigTimer = 0;
        
        // At first we're going left
        this.goingLeft = true;
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        this.getQuestEntityMovement().setWormsLike(false);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(300);
        this.setHp(300);
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawArray(Database.getAscii("places/quests/monkeyWizard/monkeyWizard"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its staff", "its staff"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(6, 6))), 3));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(1);
    }
    
    // update()
    public update(): void{
        super.update();
        
        // Is the monkey angry?
        var angry: boolean = (this.getHp() < 70 ? true : false);
        
        // Store the player position
        var playerPos: Pos = this.getQuest().getGame().getPlayer().getGlobalPosition();
        
        // Handle the timer
        if(this.timer < 80) this.timer += 1;
        else this.timer = 0;
        
        // Handle the big timer
        if(this.bigTimer < 350) this.bigTimer += 1;
        else this.bigTimer = 0;
        
        // Cast spells depending on the timer
        if(this.timer == 80 ||
           this.timer == 12 ||
           this.timer == 24 ||
           this.timer == 36 ||
           this.timer == 48 ||
           (angry && this.timer == 6) ||
           (angry && this.timer == 18) ||
           (angry && this.timer == 30) ||
           (angry && this.timer == 42) ||
           (angry && this.timer == 54)
           
        ){
            this.castSpell(false); // Not stored
        }
        else if(this.timer == 60 || this.timer == 64 || this.timer == 68 || this.timer == 72 || this.timer == 76 && this.bigTimer < 300){
            this.castSpell(true); // Stored
        }
        
        // If the player is near us (< 9) horizontally
        if(Math.abs(playerPos.x - this.getGlobalPosition().x) < 9){
            // We jump (hoping to jump above the player)
            this.jump3();
        }
        
        // If the player is even more near us (< 15) horizontally
        if(Math.abs(playerPos.x - this.getGlobalPosition().x) < 15){
            // If we're going left
            if(this.goingLeft){
                // If we're on the right of the quest
                if(this.getGlobalPosition().x > 25)
                    this.goLeft();
                // Else, we're on the left, we go right
                else{
                    this.goRight();
                    this.goingLeft = false;
                }
            }
            // Else, if we're going right
            else{
                // If the player is on the left
                if(playerPos.x < this.getGlobalPosition().x){
                    // If we're on the left side of the quest
                    if(this.getGlobalPosition().x < 75)
                        this.goRight();
                    // Else, we're on the right, we go left
                    else{
                        this.goLeft();
                        this.goingLeft = true;
                    }
                }
                // Else, the player is on the right and we're not too much on the left of the quest
                else if(this.getGlobalPosition().x > 25){
                    // We go left
                    this.goLeft();
                }
                // Else, we don't move
                else this.dontMove();
            }
        }
        // Else, we don't move
        else this.dontMove();
    }
    
    // willDie()
    public willDie(): void{
        // Candies
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(1000), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        // The monkey wizard staff
        this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "eqItemWeaponMonkeyWizardStaff", "You found a staff.", "You gain the monkey wizard staff."));
    }
    
    // Private methods
    private castSpell(stored: boolean): void{
        var ball: MonkeyWizardMagicalPurpleBall = new MonkeyWizardMagicalPurpleBall(this.getQuest(),
                                                                                    this.getGlobalPosition().plus(new Pos(3, 0)),
                                                                                    new Naming("An magical purple ball", "a magical purple ball"),
                                                                                    (stored? new Color(ColorType.MONKEY_WIZARD_BALL_STORED) : new Color(ColorType.MONKEY_WIZARD_BALL)),
                                                                                    new Pos(2, 1),
                                                                                    15,
                                                                                    this.getAndPossiblyCreateSpellCastingDamageReason(new Naming("An magical purple ball", "a magical purple ball")),
                                                                                    (stored? 350 - this.bigTimer : null)
                                                                                    );
        
        // If we're not going to be stored
        if(stored == false){
            // Target the player
            ball.setTargetTypeTargetEntity(this.getQuest().getGame().getPlayer());
        }
        else{
            // Target the roof
            ball.setTargetTypeTargetPosition(new Pos(Random.between(1, 99), Random.between(4, 9)));
        }
        
        // Add it to the quest
        this.getQuest().addEntity(ball);
    }
    
    private dontMove(): void{
        this.getQuestEntityMovement().setOffset(new Pos(0, 0));
    }
    
    private goLeft(): void{
        this.getQuestEntityMovement().setOffset(new Pos(-1, 0));
    }
    
    private goRight(): void{
        this.getQuestEntityMovement().setOffset(new Pos(1, 0));
    }
    
    private jump3(): void{
        this.jump(3);
    }
}