class Naming{
    // Name to use at the beginning of a sentence (usually begins with a capital letter)
    private beginning: string;
    
    // Name to use anywhere else
    private anywhere: string;
    
    // Constructor
    constructor(beginning: string, anywhere: string = null){
        this.beginning = beginning;
        if(anywhere != null) this.anywhere = anywhere;
        else this.anywhere = this.beginning;
    }
    
    // Public getters
    public getAnywhere(): string{
        return this.anywhere;
    }
    
    public getBeginning(): string{
        return this.beginning;
    }
}