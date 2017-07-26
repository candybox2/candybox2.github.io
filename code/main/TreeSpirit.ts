///<reference path="QuestEntity.ts"/>

class TreeSpirit extends QuestEntity{
    // The tree spirit ammunition
    private maxAmmunition: number; // Maximum ammunition the tree spirit can have at one point
    private ammunition: number; // The tree spirit continuously gain ammunition and lose ammunition when launching a magic spine
    private ammunitionTimer: number; // The timer for ammunition, is used to gain ammunition
    
    // Magic spines
    private magicSpineTimer: number; // Timer used to know when we can launch a new magic spine
    
    // The ground y position, if the player is above this position, the tree spirit will start shooting
    private groundYPosition: number;
    
    // Constructor
    constructor(quest: Quest, pos: Pos, groundYPosition: number){
        super(quest,
              pos,
              new Naming("A tree spirit", "a tree spirit"),
              new RenderArea(5, 5),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 1), new Pos(5, 2)), new CollisionBox(this, new Pos(1, 3), new Pos(3, 2))),
              new QuestEntityMovement()
             );
        
        // Set the ground y position from the value given in parameter
        this.groundYPosition = groundYPosition;
        
        // Set the default values for ammunition related variables
        this.maxAmmunition = 5;
        this.ammunition = 5;
        this.ammunitionTimer = 0;
        
        // Set the default values for magic spines related variables
        this.magicSpineTimer = 0;
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawArray(Database.getAscii("places/quests/forest/treeSpirit"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(100);
        this.setHp(100);
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Spines", "spines"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, 0), new Pos(7, 6))), 2));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(1);
    }
    
    // update()
    public update(): void{
        // Calculate the distance from the player
        var distanceFromPlayer: Pos = this.getGlobalPosition().plus(new Pos(2, 0)).getDistance(this.getQuest().getGame().getPlayer().getGlobalPosition());
        
        // Handle ammunition timer
        if(this.ammunitionTimer <= 0){
            if(this.ammunition < this.maxAmmunition)
                this.ammunition += 1;
            this.ammunitionTimer = 20;
        }
        else this.ammunitionTimer -= 1;
        
        // Handle magic spine timer
        if(this.magicSpineTimer > 0)
            this.magicSpineTimer -= 1;
        
        // Set the movement depending on the distance from the player
        this.getQuestEntityMovement().setOffset(new Pos((distanceFromPlayer.x > 0? -1:1), 0));
        
        // If the player is above the ground position
        if(this.getQuest().getGame().getPlayer().getGlobalPosition().y < this.groundYPosition){
            // If the timer is okay
            if(this.magicSpineTimer <= 0){
                // We shoot a magic spine on the left or on the right
                if(this.shootMagicSpine((distanceFromPlayer.x > 0? true:false))){ // If it worked
                    this.ammunition -= 1; // We lower the ammunition
                    this.magicSpineTimer = 12; // We set the countdown
                }
            }
        }
        
        // Call the mother class update
        super.update();
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(100 + 50*Random.upTo(10)), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
    
    // Private methods
    private shootMagicSpine(onTheLeft: boolean): boolean{
        // Create the magic spine
        var magicSpine: Fireball = new Fireball(this.getQuest(),
                                                this.getGlobalPosition().plus(new Pos((onTheLeft? -3:5), 2)),
                                                new Naming("A magical spine", "a magical spine"),
                                                new Color(ColorType.TREE_SPIRIT_MAGIC_SPINE),
                                                new Pos(3, 1),
                                                150,
                                                this.getAndPossiblyCreateSpellCastingDamageReason(new Naming("A magical spine", "a magical spine"))
                                               );
        
        // No target
        magicSpine.setTargetTypeNoTarget(new Pos((onTheLeft? -2:2), 0));
        
        // Add the entity
        return this.getQuest().addEntity(magicSpine);
    }
}