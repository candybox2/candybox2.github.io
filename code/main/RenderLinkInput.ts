class RenderLinkInput extends RenderLink{
    private element: string;
    private enigmaAnswer: EnigmaAnswer;
    private callbackCollection: CallbackCollection;
    private callbackCollectionWrong: CallbackCollection;
    
    // Constructor
    constructor(element: string, enigmaAnswer: EnigmaAnswer, callbackCollection: CallbackCollection, callbackCollectionWrong: CallbackCollection){
        super();
        this.element = element;
        this.enigmaAnswer = enigmaAnswer;
        this.callbackCollection = callbackCollection;
        this.callbackCollectionWrong = callbackCollectionWrong;
    }
    
    // Public methods
    public run(): void{
        // We copy the render link so we can use it in the functions below
        var renderLink: RenderLinkInput = this;
        
        // We set the change event
        $(this.element).change(function(event){
            // We check if the new value correspond to the answer (if it does we fire the callbacks)
            if(renderLink.enigmaAnswer.isRight($(this).val()))
                renderLink.callbackCollection.fire();
            // Here it means that the new value doesn't correspond to the answers
            else if(renderLink.callbackCollectionWrong != null){
                renderLink.callbackCollectionWrong.fire();
            }
            
            // We empty the input area
            $(this).val("");
            
            return false; // Avoid event bubbling
        });
        
        // We set the focus
        $(this.element).focus();
    }
}