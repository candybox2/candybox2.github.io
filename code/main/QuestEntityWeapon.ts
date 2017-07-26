class QuestEntityWeapon{
    // The quest we are in
    private quest: Quest;
    
    // The quest entity we are used by
    private questEntity: QuestEntity;
        
    // Combat stuff
    private damage: number;
    private cbc: CollisionBoxCollection;
    private closeCombatDelay: QuestEntityWeaponDelay = new QuestEntityWeaponDelay();
    
    // The naming
    private naming: Naming;
    
    // Constructor
    constructor(quest: Quest, questEntity: QuestEntity, naming: Naming, cbc: CollisionBoxCollection = new CollisionBoxCollection(), damage: number = 0){
        this.quest = quest;
        this.questEntity = questEntity;
        this.naming = naming;
        this.damage = damage;
        this.cbc = cbc;
    }
    
    // Public methods
    public getRealDamage(): number{
        return this.damage;
    }
    
    public getRealDamageText(): string{ // Used to display stats in the player's inventory
        return this.damage.toString();
    }
    
    public getSpeedText(): string{
        return this.closeCombatDelay.getText();
    }
    
    public handleCombat(): void{
        // If we can attack with close combat at this frame
        if(this.getRealDamage() > 0 && this.closeCombatDelay.tryToAttack()){
            // We iterate over all entities
            for(var i = 0; i < this.quest.getEntities().length; i++){
                // If we're not iterating over the entity we are used by
                if(this.quest.getEntities()[i] != this.questEntity){
                    // If the entities are from different teams
                    if(this.quest.getEntities()[i].getTeam() != this.questEntity.getTeam()){
                        // If we collide with this entity
                        if(this.collidesWith(this.quest.getEntities()[i])){
                            // We hit it
                            this.hit(this.quest.getEntities()[i]);
                            // We warn the delay
                            this.closeCombatDelay.theWeaponAttacked();
                        }
                    }
                }
            }
        }
    }
    
    // Public getters
    public getCloseCombatDelay(): QuestEntityWeaponDelay{
        return this.closeCombatDelay;
    }
    
    public getNaming(): Naming{
        return this.naming;
    }
    
    // Private methods
    private collidesWith(questEntity: QuestEntity): boolean{
        // If we both have a collision box collection, we return the result of the collision test
        if(this.cbc != null && questEntity.getCbc() != null)
           return this.cbc.collidesWith(questEntity.getCbc());
        
        // Else, we return false, there can't be any collision
        return false;
    }
    
    private hit(questEntity: QuestEntity): void{
        this.questEntity.hit(questEntity, this.getRealDamage(), new QuestEntityDamageReason(QuestEntityDamageReasonWhoType.ENTITY, 
                                                                           QuestEntityDamageReasonWhatType.WEAPON)
                                                                           .setQuestEntity(this.questEntity)
                                                                           .setQuestEntityWeapon(this));
    }
}
