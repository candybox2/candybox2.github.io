class TheComputerLine{
    // The type
    private type: TheComputerLineType;
    
    // Lines of text
    private linesOfText: string[];
    
    // Constructor
    constructor(type: TheComputerLineType, text: string){
        // Set the type
        this.type = type;
        
        // Set the lines of text depending on the text given in parameter
        this.setLinesFromText(text);
    }
    
    // Public methods
    public draw(renderArea: RenderArea, pos: Pos, minY: number): number{
        // Draw our lines of text
        for(var i = this.linesOfText.length-1; i >= 0; i--){
            // If the line isn't out of the screen
            if(pos.y - (this.linesOfText.length-1 - i) >= minY){
                // If our type isn't "CENTER"
                if(this.type != TheComputerLineType.CENTER){
                    // We draw it
                    renderArea.drawString(this.linesOfText[i], pos.x, pos.y - (this.linesOfText.length-1 - i));
                }
                // Else, it is
                else{
                    // We draw it centered
                    renderArea.drawString(this.linesOfText[i], pos.x + 16 - Math.floor(this.linesOfText[i].length/2), pos.y - (this.linesOfText.length-1 - i));
                }
            }
        }
        
        // We return the extra lines we took to draw
        return this.linesOfText.length-1;
    }

    public setLinesFromText(text: string): void{
        // Set the first line, empty
        this.linesOfText = [""];
        
        // Possibly change the text given in parameter, depending on the type
        switch(this.type){
            case TheComputerLineType.COMMAND:
                text = " > " + text;
            break;
        }
        
        // Create the array of words
        var words: string[] = text.split(" ");
        
        // Add the words one by one to our lines
        for(var i = 0; i < words.length; i++){
            // If we can add this word to the line OR the word is way too big to fit in any line anyway
            if(words[i].length + this.linesOfText[this.linesOfText.length-1].length < 32 || words[i].length > 30){
                // We add the word
                this.linesOfText[this.linesOfText.length-1] = this.linesOfText[this.linesOfText.length-1] + words[i] + " ";
            }
            // Else, we don't have enough space in the line to add the word
            else{
                // We add a new line
                this.linesOfText.push(words[i] + " ");
            }
        }
    }
    
    // Public getters
    public getType(): TheComputerLineType{
        return this.type;
    }
}