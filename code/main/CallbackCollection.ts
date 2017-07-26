class CallbackCollection{
    private callbacks: {(): void;}[] = []; // Array of functions returning void
    
    // Constructor
    constructor(...callbacks: {(): void;}[]){
        this.callbacks = callbacks;
    }
    
    // Public methods
    public addCallback(callback: {(): void;}): CallbackCollection{
        this.callbacks.push(callback);
        return this;
    }
    
    public fire(): void{
        for(var i = 0; i < this.callbacks.length; i++){
            this.callbacks[i]();
        }
    }
    
    public reset(): void{
        this.callbacks = [];
    }
}