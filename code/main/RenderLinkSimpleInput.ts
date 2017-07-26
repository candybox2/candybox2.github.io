class RenderLinkSimpleInput extends RenderLink{
    private element: string;
    private callbackCollection: CallbackCollection;
    private defaultValue: string;
    private hasFocus: boolean;
    
    // Constructor
    constructor(element: string, callbackCollection: CallbackCollection, defaultValue: string, hasFocus: boolean){
        super();
        this.element = element;
        this.callbackCollection = callbackCollection;
        this.defaultValue = defaultValue;
        this.hasFocus = hasFocus;
    }
    
    // Public methods
    public run(): void{
        // We copy the render link so we can use it in the functions below
        var renderLink: RenderLinkSimpleInput = this;
        
        // If the default value isn't null
        if(this.defaultValue != null){
            // We set the default value
            $(this.element).val(this.defaultValue);
        }
        
        // We set the change event
        $(this.element).change(function(event){
            // We fire the callback collection
            renderLink.callbackCollection.fire();
            
            return false; // Avoid event bubbling
        });
        
        if(this.hasFocus) $(this.element).focus();
    }
}