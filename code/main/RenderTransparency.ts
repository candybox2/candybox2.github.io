class RenderTransparency{
    // Variables
    private alphaCharacter: string; // Character which won't be drawn
    private metaAlphaCharacter: string; // Character which will actually show an alpha character

    // Constructor
    constructor(alphaCharacter: string, metaAlphaCharacter: string = null){
        this.alphaCharacter = alphaCharacter;
        this.metaAlphaCharacter = metaAlphaCharacter;
    }
    
    // Public getters
    public getAlphaCharacter(): string{
        return this.alphaCharacter;
    }
    
    public getMetaAlphaCharacter(): string{
        return this.metaAlphaCharacter;
    }
}