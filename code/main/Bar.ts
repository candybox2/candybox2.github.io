///<reference path="BarType.ts"/>
///<reference path="RenderArea.ts"/>
///<reference path="Resource.ts"/>

class Bar extends RenderArea{
    private type: BarType;
    private contentCharacter: string; // The character which will be displayed inside the bar
    private bordersCharacter: string; // The character used for the up and down borders of the bar
    
    // Constructor
    constructor(type: BarType){
        // Super constructor
        super();
        
        // We set the type
        this.type = type;
        
        // We set some parameters depending on the bar type
        switch(this.type){
            case BarType.SIMPLE:
                this.contentCharacter = "*";
                this.bordersCharacter = "-";
            break;
            case BarType.HEALTH: case BarType.UNICOLOR_HEALTH:
                this.contentCharacter = " ";
                this.bordersCharacter = "-";
            break;
            default:
                console.log("Error : trying to load an incorrect bar type");
            break;
        }
    }
    
    // Public methods
    public update(ratio: number, text: string = ""): boolean{
        var bordersBool: boolean;
        var lateralBordersBool: boolean;
        var textBool : boolean;
        var contentY1: number;
        var contentY2: number;
        var contentSize: number;
        var colorType: ColorType;
        
        // If we have no height, we return
        if(this.getHeight() <= 0)
            return false;
        
        // If the width is really to low, we return
        if(this.getWidth() <= 1)
            return false;
        
        // We remove all the tags and all the text
        this.removeAllTags();
        this.eraseEverything();
        
        // We decide if there will be text or not..
        if(text.length != 0) // If there is at least one character in the text to draw
            textBool = true;
        else
            textBool = false;
        
        // We decide if there will be borders or not..
        if(this.getHeight() < (textBool? 4 : 3)) // If the height is 1 or 2 without text, no borders / if the height is 1 or 2 or 3 with text, no borders
            bordersBool = false;
        else // Else, borders
            bordersBool = true;
        
        // ..and where the real content of the bar will take place
        if(bordersBool){
            contentY1 = 1;
            if(textBool) contentY2 = this.getHeight() - 3;
            else contentY2 = this.getHeight() - 2;
        }
        else{
            contentY1 = 0;
            if(textBool && this.getHeight() > 1) contentY2 = this.getHeight() - 2;
            else contentY2 = this.getHeight() - 1;
        }
        
        // We decide if there will be lateral borders
        if(this.getWidth() >= 20)
            lateralBordersBool = true;
        else
            lateralBordersBool = false;
        
        // We possibly draw the lateral borders
        if(lateralBordersBool){
            for(var i = contentY1; i <= contentY2; i++){
                this.drawString("|", 0, i);
                this.drawString("|", this.getWidth()-1, i);
            }
        }
        
        // We draw the borders if there are borders
        if(bordersBool){
            this.drawHorizontalLine(this.bordersCharacter, 0, this.getWidth()-1, 0);
            if(textBool) this.drawHorizontalLine(this.bordersCharacter, 0, this.getWidth()-1, this.getHeight()-2);
            else this.drawHorizontalLine(this.bordersCharacter, 0, this.getWidth()-1, this.getHeight()-1);
        }
        
        // We calculate the content size
        contentSize = Math.floor((this.getWidth()-(lateralBordersBool? 2:0))*ratio);
        if(contentSize == 0 && ratio > 0) contentSize = 1; // If the ratio is > 0, then the content size can't be == 0
        
        // We draw the content if the content size is > 0
        if(contentSize > 0){
            for(var i = contentY1; i <= contentY2; i++){
                this.drawHorizontalLine(this.contentCharacter, (lateralBordersBool? 1:0), contentSize, i);
            }
        }
        
        // We draw the text if there is text
        if(textBool){
            this.drawString(text, (text.length > this.getWidth()? 0 : Math.floor(this.getWidth()/2 - text.length/2)), this.getHeight()-1);
        }
        
        // We add special tags, depending on the type of bar
        switch(this.type){
            case BarType.HEALTH: case BarType.UNICOLOR_HEALTH:
                // We choose the color
                if(this.type == BarType.HEALTH){
                    if(ratio < 0.2) colorType = ColorType.HEALTH_RED;
                    else if(ratio < 0.5) colorType = ColorType.HEALTH_ORANGE;
                    else colorType = ColorType.HEALTH_GREEN;
                }
                else colorType = ColorType.HEALTH_UNICOLOR;
                
                // We add the tags
                if(contentSize > 0){
                    for(var i = contentY1; i <= contentY2; i++){
                        this.addBackgroundColor((lateralBordersBool? 1:0), (lateralBordersBool? 1:0) + contentSize, i, new Color(colorType));
                    }
                }
            break;
        }
        
        // Finally, we return true
        return true;
    }
}
