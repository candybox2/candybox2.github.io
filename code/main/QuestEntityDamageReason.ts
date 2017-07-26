class QuestEntityDamageReason{
    // Type of the thing who caused the damage
    private whoType: QuestEntityDamageReasonWhoType;
    
    // Additional parameters, depeding on the who type
        // NATURE : no parameter
        // ENTITY
        private questEntity: QuestEntity = null;
        private questEntityTeam: QuestEntityTeam = null;
    
    // Type of the thing used to cause the damage
    private whatType: QuestEntityDamageReasonWhatType;
    
    // Additional parameters, depeding on the what type
        // WEAPON
        private questEntityWeapon: QuestEntityWeapon = null;
        // SPELL
        private spellNaming: Naming = null;
    
    // Constructor
    constructor(whoType: QuestEntityDamageReasonWhoType, whatType: QuestEntityDamageReasonWhatType){
        this.whoType = whoType;
        this.whatType = whatType;
    }
    
    // Public methods
    public getQuestEntityTeam(): QuestEntityTeam{
        return this.questEntityTeam;
    }
    
    public getWhatNaming(): Naming{
        switch(this.whatType){
            case QuestEntityDamageReasonWhatType.WEAPON:
                return this.questEntityWeapon.getNaming();
            break;
            case QuestEntityDamageReasonWhatType.SPELL:
                return this.spellNaming;
            break;
        }
    }
    
    public getWhoNaming(): Naming{
        switch(this.whoType){
            case QuestEntityDamageReasonWhoType.NATURE:
                return new Naming("Nature", "nature");
            break;
            case QuestEntityDamageReasonWhoType.ENTITY:
                return this.questEntity.getNaming();
            break;
        }
    }
    
    // Public setters
    public setQuestEntity(questEntity: QuestEntity, questEntityTeam: QuestEntityTeam = null): QuestEntityDamageReason{
        this.questEntity = questEntity;
        if(questEntityTeam == null) this.questEntityTeam = questEntity.getTeam();
        else this.questEntityTeam = questEntityTeam;
        return this;
    }
    
    public setQuestEntityWeapon(questEntityWeapon: QuestEntityWeapon): QuestEntityDamageReason{
        this.questEntityWeapon = questEntityWeapon;
        return this;
    }
    
    public setSpellNaming(naming: Naming): QuestEntityDamageReason{
        this.spellNaming = naming;
        return this;
    }
}