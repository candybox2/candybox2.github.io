class RenderLinkCheckbox extends RenderLink{
    private element: string;
    private callbackCollectionWhenChecked: CallbackCollection;
    private callbackCollectionWhenUnchecked: CallbackCollection;
    
    // Constructor
    constructor(element: string, callbackCollectionWhenChecked: CallbackCollection, callbackCollectionWhenUnchecked: CallbackCollection){
        super();
        this.element = element;
        this.callbackCollectionWhenChecked = callbackCollectionWhenChecked;
        this.callbackCollectionWhenUnchecked = callbackCollectionWhenUnchecked;
    }
    
    // Public methods
    public run(): void{
        // We copy the render link so we can use it in the functions below
        var renderLink: RenderLinkCheckbox = this;
        
        // We set the change event
        $(this.element).change(function(event){
           if($(this).is(':checked')){
                // We fire the callback collection
                renderLink.callbackCollectionWhenChecked.fire();
            }
            else{
                renderLink.callbackCollectionWhenUnchecked.fire();
            }
            
            return false; // Avoid event bubbling
        });
    }
}