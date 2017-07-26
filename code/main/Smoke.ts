class Smoke{
    // Position
    private x: number;
    private y: number;
    
    // Size
    private width: number;
    private height: number;

    // Other stuff
    private inverted: boolean; // True if the smoke is inverted
    
    // Gap (position gap between x y and the real current smoke position)
    private xGap: number;
    private yGap: number;
    
    // Waiting time between two smokes
    private minWaitingTime: number;
    private maxWaitingTime: number;
    
    private chosenWaitingTime: number;
    private currentWaitingTime: number;
    private weAreWaiting: boolean;

    // Constructor
    constructor(x: number, y: number, width: number, height: number, minWaitingTime: number = 0, maxWaitingTime: number = 0){
        // Position
        this.x = x;
        this.y = y;
        
        // Size
        this.width = width;
        this.height = height;
        
        // Waiting time
        this.minWaitingTime = minWaitingTime;
        this.maxWaitingTime = maxWaitingTime;
        
        // Init the smoke
        this.init(false);
    }
    
    // Public methods
    public draw(renderArea: RenderArea){
        // If we're not waiting, we draw a smoke
        if(this.weAreWaiting == false){
            if(this.inverted == false){
                renderArea.drawString("(", this.x + this.xGap, this.y + this.yGap);
                renderArea.drawString(")", this.x + this.xGap + 1, this.y + this.yGap - 1);
            }
            else{
                renderArea.drawString("(", this.x + this.xGap, this.y + this.yGap - 1);
                renderArea.drawString(")", this.x + this.xGap + 1, this.y + this.yGap); 
            }
        }
    }
    
    public move(): void{
        if(this.weAreWaiting == false){
            // We make the smoke going up
            this.yGap--;
            
            // If it's too high, we call init()
            if(-this.yGap >= this.height){
                this.init();
            }
            // Else we invert it
            else{
                this.inverted = !this.inverted;
            }
        }
        else{
            this.currentWaitingTime++;
            if(this.currentWaitingTime > this.chosenWaitingTime)
                this.weAreWaiting = false;
        }
    }
    
    // Private methods
    private init(weMustBeWaitingAtFirst: boolean = true): void{
        // Inverted
        this.inverted = Random.flipACoin();
        
        // Step
        this.xGap = Random.upTo(this.width-1);
        
        // At first we're not waiting
        if(Random.flipACoin() && weMustBeWaitingAtFirst == false){
            // Y position
            this.yGap = -Random.upTo(this.height-1);
            
            // Waiting stuff
            this.weAreWaiting = false;
        }
        // At first we are waiting
        else{
            // Y position
            this.yGap = 0;
            
            // Waiting stuff
            this.weAreWaiting = true;
            this.chosenWaitingTime = Random.between(this.minWaitingTime, this.maxWaitingTime); // We choose the waiting time
            this.currentWaitingTime = 0; // We begin at 0
        }
    }
}
