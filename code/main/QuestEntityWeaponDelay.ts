class QuestEntityWeaponDelay{
    // The type
    private type: QuestEntityWeaponDelayType;
    
    // Variables useful no matter the type
    private currentDelay: number;
    private maxDelay: number;
    
    // If the type is QuestEntityWeaponDelayType.BETWEEN
    private minBetweenDelay: number;
    private maxBetweenDelay: number;
    
    // Constructor
    constructor(){
        // By default, the type is FIXED and the maxDelay is 0
        this.type = QuestEntityWeaponDelayType.FIXED;
        this.currentDelay = 0;
        this.maxDelay = 0;
    }
    
    // Public methods
    public getText(): string{
        // Create the delay var
        var delay: number;
        
        // Set the delay we should use
        if(this.type == QuestEntityWeaponDelayType.BETWEEN)
            delay = Math.floor(this.minBetweenDelay + (this.maxBetweenDelay - this.minBetweenDelay)/2);
        else
            delay = this.maxDelay;
        
        // Return the text depending on this delay
        switch(delay){
            case 0: return "incredibly fast"; break;
            case 1: return "very fast"; break;
            case 2: return "fast"; break;
            case 3: return "rather fast"; break;
            case 4: return "medium speed";
            case 5: return "rather slow"; break;
            case 6: case 7: return "slow"; break;
            case 8: case 9: return "very slow"; break;
            case 10: case 11: case 12: case 13: case 14: return "incredibly slow"; break;
            default: "couldn't be slower"; break;
        }
    }
    
    public tryToAttack(): boolean{
        // We increase the current delay
        this.currentDelay++;
        
        switch(this.type){
            case QuestEntityWeaponDelayType.FIXED:
                // If it's time to attack
                if(this.currentDelay > this.maxDelay){
                    this.currentDelay = 0;
                    return true;
                }
            break;
            case QuestEntityWeaponDelayType.BETWEEN:
                // If it's time to attack
                if(this.currentDelay > this.maxDelay){
                    this.currentDelay = 0;
                    this.chooseBetweenDelay();
                    return true;
                }
            break;
            case QuestEntityWeaponDelayType.ONCE_THEN_WAIT:
                // If it's time to attack
                if(this.currentDelay > this.maxDelay){
                    return true;
                }
            break;
        }
        
        return false;
    }
    
    public setBetweenDelay(minBetweenDelay: number, maxBetweenDelay: number, currentDelay: number = 0): void{
        this.type = QuestEntityWeaponDelayType.BETWEEN;
        this.minBetweenDelay = minBetweenDelay;
        this.maxBetweenDelay = maxBetweenDelay;
        this.chooseBetweenDelay();
    }
    
    public setFixedDelay(maxDelay: number = 0, currentDelay: number = 0): void{
        this.type = QuestEntityWeaponDelayType.FIXED;
        this.maxDelay = maxDelay;
        this.currentDelay = currentDelay;
    }
    
    public setOnceThenWaitDelay(maxDelay: number = 0, currentDelay: number = 0): void{
        this.type = QuestEntityWeaponDelayType.ONCE_THEN_WAIT;
        this.maxDelay = maxDelay;
        this.currentDelay = currentDelay;
    }
    
    public theWeaponAttacked(): void{
        if(this.type == QuestEntityWeaponDelayType.ONCE_THEN_WAIT)
            this.currentDelay = 0;
    }
    
    // Private methods
    private chooseBetweenDelay(): void{
        this.maxDelay = Random.between(this.minBetweenDelay, this.maxBetweenDelay);
    }
}
