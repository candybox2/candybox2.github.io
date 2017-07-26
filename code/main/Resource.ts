///<reference path="CallbackCollection.ts"/>

class Resource{
    // Attributes
    private accumulated: number = 0;
    private current: number = 0;
    private max: number = 0;
    private callbackCollection: CallbackCollection = new CallbackCollection();
    
    // The saving prefix (used in the load and save methods, and in the constructor to register stuff)
    private savingPrefix: string;
    
    // Constructor
    constructor(savingPrefix: string = null){
        // Set the saving prefix
        this.savingPrefix = savingPrefix;
    }
    
    // Public methods
    public add(n: number): boolean{
        // If the operation would leave an < 0 value, we stop
        if(this.current + n < 0)
            return false;
        
        // If we add a positive value, we also add it to the accumulated
        if(n > 0)
            this.setAccumulated(this.accumulated + n);
        
        // We add to the current value
        this.setCurrent(this.current + n);
        
        // We return true
        return true;
    }
    
    public load(): void{
        this.setAccumulated(Saving.loadNumber(this.savingPrefix + "Accumulated"));
        this.setCurrent(Saving.loadNumber(this.savingPrefix + "Current"));
        this.setMax(Saving.loadNumber(this.savingPrefix + "Max"));
    }
    
    public save(): void{
        Saving.saveNumber(this.savingPrefix + "Accumulated", this.getAccumulated());
        Saving.saveNumber(this.savingPrefix + "Current", this.getCurrent());
        Saving.saveNumber(this.savingPrefix + "Max", this.getMax());
    }
    
    public transferTo(resource: Resource, howMany: number = -1, ratio: number = 1): boolean{
        // If howMany is below 0, then we transfer everything
        if(howMany < 0)
            howMany = this.current;
        else{
            // If we don't have enough to transfer, we return false
            if(howMany > this.current)
                return false;
        }
        
        // We lower our current quantity
        this.add(-howMany);
        
        // We add to the other resource
        resource.add(howMany * ratio);
        
        // We return true
        return true;
    }

    // Public getters
    public getAccumulated(): number{
        return this.accumulated;
    }
    
    public getCurrent(): number{
        return this.current;
    }
    
    public getCurrentAsString(): string{
        return this.current.toString();
    }
    
    public getCallbackCollection(): CallbackCollection{
        return this.callbackCollection;
    }
    
    public getMax(): number{
        return this.max;
    }
    
    // Public setters
    public setCurrent(n: number) : void{
        // Set the value
        this.current = n;
        
        // Check if the max value should change
        if(this.current > this.max)
            this.max = this.current;
        
        // Fire the callbacks
        this.callbackCollection.fire();
    }
    
    // Private methods
    private setAccumulated(n: number): void{
        this.accumulated = n;
    }
    
    private setMax(n: number): void{
        this.max = n;
    }
}
