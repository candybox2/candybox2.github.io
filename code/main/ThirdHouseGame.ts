class ThirdHouseGame{
    // The third house
    private thirdHouse: ThirdHouse;
    
    // The render area
    private renderArea: RenderArea;
    
    // Constructor
    constructor(thirdHouse: ThirdHouse){
        // Set the third house from parameter
        this.thirdHouse = thirdHouse;
        
        // Create the area
        this.renderArea = new RenderArea(53, 12);
        
        // Set the quest slowed down variable at the game level (and the quest speed up too)
        this.thirdHouse.getGame().setQuestSlowedDown(false);
        this.thirdHouse.getGame().setQuestSpeedUp(0);
    }
    
    // Public methods
    public pressedDownButton(): void{
        
    }
    
    public pressedSpaceButton(): void{
        
    }
    
    public pressedUpButton(): void{
        
    }
    
    public run(): boolean{
        return true;
    }
    
    // Public getters
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    public getThirdHouse(): ThirdHouse{
        return this.thirdHouse;
    }
}