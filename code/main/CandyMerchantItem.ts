class CandyMerchantItem{
    // The game
    private game: Game;
    
    // The saving bool, used to remember if the item was bought or not
    private savingBool: string;
    
    // The ascii art
    private asciiName: string; // Name of the ascii art in the database
    private asciiPosition: Pos; // Position of the ascii art in the scene
    
    // The database name of the speech the merchant should deliver when we click on the item
    private merchantSpeech: string;
    
    // The price of the item
    private price: number;
    
    // The database name of the text written on the buying button
    private buttonText: string;
    
    // The class used both for the button to make the item clickable and the buying button
    private buttonName: string;
    
    // Constructor
    constructor(game: Game, savingBool: string, asciiName: string, asciiPosition: Pos, merchantSpeech: string, price: number, buttonText: string, buttonName: string){
        this.game = game;
        this.savingBool = savingBool;
        this.asciiName = asciiName;
        this.asciiPosition = asciiPosition;
        this.merchantSpeech = merchantSpeech;
        this.price = price;
        this.buttonText = buttonText;
        this.buttonName = buttonName;
    }
    
    // Public methods
    public buy(): void{
        // We tell the saving system that this item is bought
        Saving.saveBool(this.savingBool, true);
    }
    
    public canBeBought(): boolean{ // Return true if we can buy the item, else return false
        // If it's already bought, we return false
        if(this.isBought())
            return false;
        
        return true;
    }
    
    public canBeClicked(): boolean{ // Return true if you can click on the item, else return false
        // If it's already bought, we return false
        if(this.isBought())
            return false;
        
        return true;
    }
    
    public canBeShown(): boolean{
        // If it's already bought, we return false
        if(this.isBought())
            return false;

        return true;
    }
    
    public isBought(): boolean{
        return Saving.loadBool(this.savingBool);
    }
    
    // Public getters
    public getAsciiName(): string{
        return this.asciiName;
    }
    
    public getAsciiPosition(): Pos{
        return this.asciiPosition;
    }
    
    public getButtonName(): string{
        return this.buttonName;
    }
    
    public getButtonText(): string{
        return this.buttonText;
    }
    
    public getGame(): Game{
        return this.game;
    }
    
    public getMerchantSpeech(): string{
        return this.merchantSpeech;
    }
    
    public getPrice(): number{
        return this.price;
    }
}