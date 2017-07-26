class QuestEntitySpellCaster{
    // The delay
    private delay: QuestEntityWeaponDelay = new QuestEntityWeaponDelay();
    
    // The callback collection
    private callbackCollection: CallbackCollection;
    
    // Constructor
    constructor(callbackCollection: CallbackCollection){
        this.callbackCollection = callbackCollection;
    }
    
    // Public methods
    public tryToCast(): void{
        if(this.delay.tryToAttack()){
            this.callbackCollection.fire();
        }
    }
    
    // Public getters
    public getDelay(): QuestEntityWeaponDelay{
        return this.delay;
    }
}