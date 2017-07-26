///<reference path="House.ts"/>

class ThirdHouse extends House{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // The game running
    private gameRunning: ThirdHouseGame = null;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resizeFromArray(Database.getAscii("places/village/thirdHouse"), 0, 3);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // willBeDisplayed()
    public willBeDisplayed(): void{
        this.getGame().getQuestCallbackCollection().addCallback(this.runGame.bind(this));
        
        // Add some hotkeys
        this.getGame().addHotkey(new Hotkey("up", new CallbackCollection(this.pressedUpButton.bind(this))));
        this.getGame().addHotkey(new Hotkey("down", new CallbackCollection(this.pressedDownButton.bind(this))));
        this.getGame().addHotkey(new Hotkey("space", new CallbackCollection(this.pressedSpaceButton.bind(this))));
    }
    
    
    // Private methods
    private addControls(x: number, y: number): void{
        // If there's a game running, we add the controls
        if(this.gameRunning != null){
            // UP button
            this.renderArea.addAsciiButton(x, x + 4, y, "thirdHouseUpButton");
            this.renderArea.addLinkCall(".thirdHouseUpButton", new CallbackCollection(this.pressedUpButton.bind(this)));
            
            // Space button
            this.renderArea.addAsciiButton(x + 7, x + 25, y + 1, "thirdHouseSpaceButton");
            this.renderArea.addLinkCall(".thirdHouseSpaceButton", new CallbackCollection(this.pressedSpaceButton.bind(this)));
            
            // DOWN button
            this.renderArea.addAsciiButton(x + 28, x + 34, y, "thirdHouseDownButton");
            this.renderArea.addLinkCall(".thirdHouseDownButton", new CallbackCollection(this.pressedDownButton.bind(this)));
        }
    }
    
    private addInsertCandiesButtons(x: number, y: number): void{
        // First button (10 candies)
        this.renderArea.addAsciiButton(x, x + 4, y, "thirdHouseInsert10CandiesButton");
        this.renderArea.addLinkCall(".thirdHouseInsert10CandiesButton", new CallbackCollection(this.insert10Candies.bind(this)));
        
        // Second button (1000 candies)
        this.renderArea.addAsciiButton(x, x + 4, y+2, "thirdHouseInsert1000CandiesButton");
        this.renderArea.addLinkCall(".thirdHouseInsert1000CandiesButton", new CallbackCollection(this.insert1000Candies.bind(this)));
    }
    
    private insert10Candies(): void{
        // If we have enough candies
        if(this.getGame().getCandies().getCurrent() >= 10){
            // We pay the price
            this.getGame().getCandies().add(-10);
            // We launch the game
            this.gameRunning = new SuperRPG(this);
        }
    }
    
    private insert1000Candies(): void{
        // If we have enough candies
        if(this.getGame().getCandies().getCurrent() >= 1000){
            // We pay the price
            this.getGame().getCandies().add(-1000);
            // We launch the game
            this.gameRunning = new GalacticWars(this);
        }
    }
    
    private pressedDownButton(): void{
        if(this.gameRunning != null)
            this.gameRunning.pressedDownButton();
    }
    
    private pressedSpaceButton(): void{
        if(this.gameRunning != null)
            this.gameRunning.pressedSpaceButton();
    }
    
    private pressedUpButton(): void{
        if(this.gameRunning != null)
            this.gameRunning.pressedUpButton();
    }
    
    private runGame(): void{
        // If there's a game running, we run it
        if(this.gameRunning != null){
            // If it should stop running
            if(this.gameRunning.run() == true){
                this.gameRunning = null; // We set it to null
                // We update
                this.update();
                this.getGame().updatePlace();
            }
            // Else
            else{
                // We update
                this.update();
                // We draw the game on the screen
                this.renderArea.drawArea(this.gameRunning.getRenderArea(), 19, 10);
                // We update at the game level
                this.getGame().updatePlace();
            }
        }
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the village button
        this.addBackToTheVillageButton(this.renderArea, "thirdHouseBackToTheVillageButton");
        
        // Draw the house
        this.renderArea.drawArray(Database.getAscii("places/village/thirdHouse"), 0, 3);
        
        // Add the buttons to insert candies
        this.addInsertCandiesButtons(25, 28);
        
        // Add the buttons to control the game
        this.addControls(29, 24);
    }
}