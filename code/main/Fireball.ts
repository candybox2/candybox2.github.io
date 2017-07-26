///<reference path="QuestEntitySpell.ts"/>

class Fireball extends QuestEntitySpell{
    // Our size
    private size: Pos;
    
    // Target stuff
    private targetType: FireballTargetType = FireballTargetType.NO_TARGET;
        // If FireballTargetType.TARGET_ENTITY or FireballTargetType.TARGET_POSITION
        private speed;
        // If FireballTargetType.TARGET_ENTITY or FireballTargetType.TARGET_STICK_ON_ENTITY
        private fireballTargetEntity: QuestEntity;
        // If FireballTargetType.TARGET_ENTITY
        private specialTargetDamage: number; // Special damage inflicted to the target
        // If FireballTargetType.TARGET_STICK_ON_ENTITY
        private specialTargetPosition: Pos; // Special position of the fireball relatively to the target
        // If FireballTargetType.TARGET_POSITION
        private targetPosition: Pos;
        
    // Damage
    private damage: number;
    
    // Collision box collection (only used for our special way of handling damage)
    private damageCollisionBoxCollection: CollisionBoxCollection;
    
    // The quest entity damage reason we must provinde when inflicting damage to someone
    private questEntityDamageReason: QuestEntityDamageReason;
    
    // Constructor
    constructor(quest: Quest, pos: Pos, naming: Naming, color: Color, size: Pos, damage: number, questEntityDamageReason: QuestEntityDamageReason){
        // Call the mother class constructor
        super(quest, pos, naming);
        
        // Set the size
        this.size = size;
        
        // Set the damage
        this.damage = damage;
        
        // Set the quest entity damage reason
        this.questEntityDamageReason = questEntityDamageReason;
        
        // Create the damage collision box collection
        this.damageCollisionBoxCollection = new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), this.size));
        
        // Add the color
        this.addColor(new QuestEntitySpellColor(this.getQuest(), new Pos(0, 0), this.size, color));
        
        // Create a quest entity movement
        this.setQuestEntityMovement(new QuestEntityMovement(new Pos(0, 0)));
        
        // Set the default target type
        this.setTargetTypeNoTarget(new Pos(0, 0));
    }
    
    // Public methods
    public setTargetTypeNoTarget(movement: Pos): void{
        this.targetType = FireballTargetType.NO_TARGET;
        this.getQuestEntityMovement().setOffset(movement); // Set the movement (it will be kept later by itself)
    }
    
    public setTargetTypeTargetEntity(entity: QuestEntity, specialTargetDamage: number = null, speed: Pos = new Pos(1, 1)): void{
        this.targetType = FireballTargetType.TARGET_ENTITY;
        this.fireballTargetEntity = entity;
        this.specialTargetDamage = specialTargetDamage;
        this.speed = speed;
    }
    
    public setTargetTypeTargetPosition(pos: Pos, speed: Pos = new Pos(1, 1)): void{
        this.targetType = FireballTargetType.TARGET_POSITION;
        this.targetPosition = pos;
        this.speed = speed;
    }
    
    public setTargetTypeTargetStickOnEntity(entity: QuestEntity, specialTargetPosition: Pos = new Pos(0, 0)): void{
        this.targetType = FireballTargetType.TARGET_STICK_ON_ENTITY;
        this.fireballTargetEntity = entity;
        this.specialTargetPosition = specialTargetPosition;
    }
    
    public update(): void{
        // If we target an entity
        if(this.targetType == FireballTargetType.TARGET_ENTITY){
            // If this entity is still alive
            if(this.fireballTargetEntity != null && this.fireballTargetEntity.getDead() == false){
                // We go towards it
                this.goTowards(this.getGlobalPosition().plus(new Pos(Math.floor(this.size.x/2), Math.floor(this.size.y/2))), this.fireballTargetEntity.getRenderAreaCenter(), 0, this.speed);
            }
            // Else, we die
            else this.setDead(true);
        }
        // Else, if we target to stick on an entity
        else if(this.targetType == FireballTargetType.TARGET_STICK_ON_ENTITY){
            // If this entity is still alive
            if(this.fireballTargetEntity != null && this.fireballTargetEntity.getDead() == false){
                // We teleport on it
                this.teleport(this.fireballTargetEntity.getGlobalPosition().plus(this.specialTargetPosition));
            }
            // Else, we die
            else this.setDead(true);
        }
        // Else, if we target a position
        else if(this.targetType == FireballTargetType.TARGET_POSITION){
            // We go towards this position
            this.goTowards(this.getGlobalPosition().plus(new Pos(Math.floor(this.size.x/2), Math.floor(this.size.y/2))), this.targetPosition, 0, this.speed);
        }
        
        // Handle our damage
        this.handleDamage();
        
        // Call the mother class update method
        super.update();
    }
    
    // willDie()
    public willDie(): void{}
    
    // Private methods
    private handleDamage(): void{
        // We iterate over entities
        for(var i = 0; i < this.getQuest().getEntities().length; i++){
            // If it is from a different team than the team of the entity which launched the fireball
            if(this.questEntityDamageReason.getQuestEntityTeam() != this.getQuest().getEntities()[i].getTeam()){
                // If it is destructible
                if(this.getQuest().getEntities()[i].getDestructible()){
                    // If it has a collision box collection
                    if(this.getQuest().getEntities()[i].getCbc() != null){
                        // If this collision box collection collides with ours
                        if(this.getQuest().getEntities()[i].getCbc().collidesWith(this.damageCollisionBoxCollection)){
                            // If...
                            if(this.getQuest().getEntities()[i] == this.fireballTargetEntity && // This is the entity we're targetting
                            this.targetType == FireballTargetType.TARGET_ENTITY && // We actually target an entity
                            this.fireballTargetEntity != null && // Which is not null
                            this.fireballTargetEntity.getDead() == false && // And not dead
                            this.specialTargetDamage != null // And we want to inflict it special damage
                            ){
                                this.getQuest().getEntities()[i].inflictDamage(this.specialTargetDamage, this.questEntityDamageReason);
                            }
                            // Else, we just inflict normal damage
                            else{
                                this.getQuest().getEntities()[i].inflictDamage(this.damage, this.questEntityDamageReason);
                            }
                            // We die because we inflicted damage
                            this.setDead(true);
                        }
                    }
                }
            }
        }
    }
}