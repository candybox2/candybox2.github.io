class QuestEntityAnimation{
    // Ascii-related variables
    private asciiNames: string[];
    private currentAsciiIndex: number;
    
    // Time-related variables
    private currentTime: number;
    private intervalTime: number;
    
    // Constructor
    constructor(intervalTime: number, currentTime: number, currentAsciiIndex: number, ...asciiNames: string[]){
        this.intervalTime = intervalTime;
        this.currentTime = currentTime;
        this.currentAsciiIndex = currentAsciiIndex;
        this.asciiNames = asciiNames;
    }
    
    // Public methods
    public draw(renderArea: RenderArea): void{
        renderArea.drawArray(Database.getAscii(this.asciiNames[this.currentAsciiIndex]));
    }
    
    public shouldUpdateRenderAreaAtThisFrame(): boolean{
        return (this.currentTime == this.intervalTime);
    }
    
    public update(): void{
        this.currentTime += 1;
        if(this.currentTime > this.intervalTime){
            this.currentTime = 0;
            this.currentAsciiIndex += 1;
            if(this.currentAsciiIndex >= this.asciiNames.length)
                this.currentAsciiIndex = 0;
        }
    }
    
    // Public getters
    public getCurrentAsciiIndex(): number{
        return this.currentAsciiIndex;
    }
}
