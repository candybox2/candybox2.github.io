class SuperRPGMenuEntry{
    // The callback collection we need to call if the entry is chosen
    private callbackCollection: CallbackCollection;
    
    // The entry text
    private text: string;
    
    // Constructor
    constructor(text: string, callbackCollection: CallbackCollection){
        this.text = text;
        this.callbackCollection = callbackCollection;
    }
    
    // Public methods
    public draw(renderArea : RenderArea, x: number, y: number, selected: boolean, width: number): void{
        // Create a var which will contain the text to draw
        var textToDraw: string;
        
        // Set the text to draw
        if(selected)
            textToDraw = "> " + this.text + " <";
        else
            textToDraw = this.text;
            
        // Draw the text to draw
        renderArea.drawString(textToDraw, x + Math.floor((width - textToDraw.length)/2), y);
    }
    
    // Public getters
    public getCallbackCollection(): CallbackCollection{
        return this.callbackCollection;
    }
}