class QuestEntityMovement{
    // Time stuff
    private currentTime: number;
    private intervalTime: number;
    
    // The movement itself (= how much we should move on x and y at each frame)
    private offset: Pos;
    
    // Special bools
    private gravity: boolean = false; // If true, then the entity which has this movement is affected by gravity
    private wormsLike: boolean = false; // If true, then the entity which has this movement will move like a worms (in the Team 17 games) : it can climb steps of one character and don't "fall" if the go down of just one character
    
    // Constructor
    constructor(offset: Pos = new Pos(0, 0), intervalTime: number = 0, currentTime: number = 0){
        this.offset = offset;
        this.intervalTime = intervalTime;
        this.currentTime = currentTime;
    }
    
    // Public methods
    public shouldMoveAtThisFrame(): boolean{
        return (this.currentTime == this.intervalTime);
    }
    
    public update(): void{
        this.currentTime += 1;
        if(this.currentTime > this.intervalTime) this.currentTime = 0;
    }
    
    // Public getters
    public getCurrentFrameMovement(): Pos{
        if(this.shouldMoveAtThisFrame())
            return this.offset;
        else
            return new Pos(0, 0);
    }
    
    public getGravity(): boolean{
        return this.gravity;
    }
    
    public getOffset(): Pos{
        return this.offset;
    }
    
    public getWormsLike(): boolean{
        return this.wormsLike;
    }
    
    // Public setters
    public setGravity(value: boolean): void{
        this.gravity = value;
    }
    
    public setOffset(offset: Pos): void{
        this.offset = offset;
    }
    
    public setWormsLike(value: boolean): void{
        this.wormsLike = value;
    }
}
