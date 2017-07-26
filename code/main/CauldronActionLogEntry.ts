class CauldronActionLogEntry{
    // The action
    private action: CauldronAction;
    
    // How much time?
    private time: number;
    
    // How much candies & lollipops at the end of the action?
    private candies: number;
    private lollipops: number;
    
    // Constructor
    constructor(action: CauldronAction, time: number, candies: number, lollipops: number){
        this.action = action;
        this.time = time;
        this.candies = candies;
        this.lollipops = lollipops;
    }
    
    // Public getters
    public getAction(): CauldronAction{
        return this.action;
    }
    
    public getCandies(): number{
        return this.candies;
    }
    
    public getLollipops(): number{
        return this.lollipops;
    }
    
    public getTime(): number{
        return this.time;
    }
}