///<reference path="RenderTag.ts"/>

class RenderTagLt extends RenderTag{
    // Constructor
    constructor(x: number){
        super(x, "");
    }
    
    // Public methods
    public clone(): RenderTagLt{
        return <RenderTagLt>super.clone();
    }
    
    public draw(str: string): string{
        // Instead of adding ourselves, we delete one character under the x position and then add the "&lt;"
        str = str.replaceAt(this.getX(), "&");
        return str.addAt(this.getX()+1, "lt;");
    }
}