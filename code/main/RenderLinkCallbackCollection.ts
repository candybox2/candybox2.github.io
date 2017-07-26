class RenderLinkCallbackCollection extends RenderLink{
    private callbackCollection: CallbackCollection;
    
    // Constructor
    constructor(callbackCollection: CallbackCollection){
        super();
        this.callbackCollection = callbackCollection;
    }
    
    // Public methods
    public run(): void{
        this.callbackCollection.fire();
    }
}