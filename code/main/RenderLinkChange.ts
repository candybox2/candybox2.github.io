class RenderLinkChange extends RenderLink{
    private element: string;
    private callbackCollection: CallbackCollection;
    
    // Constructor
    constructor(element: string, callbackCollection: CallbackCollection){
        super();
        this.element = element;
        this.callbackCollection = callbackCollection;
    }
    
    // Public methods
    public run(): void{
        // We copy the render link so we can use it in the functions below
        var renderLink: RenderLinkChange = this;
        
        $(this.element).change(function(event){
            renderLink.callbackCollection.fire();
            return false; // Avoid event bubbling
        });
    }
}