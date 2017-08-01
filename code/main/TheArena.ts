///<reference path="Place.ts"/>

class TheArena extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        this.renderArea.resize(100, 20);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Private methods
    private drawQuestLogo(questFolderName: string, x: number, y: number): void{
        // If the quest folder name given isn't null
        if(questFolderName != null){
            // If this quest doesn't exist
            if(TheArenaModule.getQuest(questFolderName) == null)
                console.log("Trying to draw the arena quest " + questFolderName + " which wasn't added to the arena module.");
            // Else, this quest exists
            else{
                // Draw the logo
                TheArenaModule.getQuest(questFolderName).drawLogo(this.renderArea, x, y, this.getGame());
            }
        }
        
        // Draw the borders
        this.renderArea.drawHorizontalLine("-", x, x + 19, y);
        this.renderArea.drawHorizontalLine("-", x, x + 19, y + 5);
        this.renderArea.drawVerticalLine("|", x, y, y + 5);
        this.renderArea.drawVerticalLine("|", x + 19, y, y + 5);
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Quick explanation
        this.renderArea.drawString("The Arena is a special area featuring additional quests written by players.", 12, 1);
        
        // List of quests
        this.drawQuestLogo("peacefulForest", 2, 3);
        this.drawQuestLogo("hardcorePlatformer", 21, 3);
        this.drawQuestLogo(null, 40, 3);
        this.drawQuestLogo(null, 59, 3);
        this.drawQuestLogo(null, 78, 3);
        
        this.drawQuestLogo(null, 2, 8);
        this.drawQuestLogo(null, 21, 8);
        this.drawQuestLogo(null, 40, 8);
        this.drawQuestLogo(null, 59, 8);
        this.drawQuestLogo(null, 78, 8);
        
        // Hardmode
        this.renderArea.drawString("If you want more challenge, you can also play hardmode here : ", 1, 17);
        this.renderArea.addHtmlLink(63, 17, "http://candybox2.github.io/?gamemode=hard", "http://candybox2.github.io/?gamemode=hard");
        
        // Create your quest!
        this.renderArea.drawString("If you're a programmer and you want to create a quest,                     and                 !", 1, 15);
        this.renderArea.addHtmlLink(56, 15, "source_code.html", "get the source code");
        this.renderArea.addHtmlLink(80, 15, "create_quest.html", "follow the guide");
    }
}
