class TheArenaModuleQuest{
    // Name of the quest folder (used in ascii/arena and code/arena)
    private questFolderName: string;
    
    // The special callback which returns a new quest
    private specialCallback: {(game: Game): Place;};
    
    // Constructor
    constructor(questFolderName: string, specialCallback: {(): Place;}){
        // Set from parameters
        this.questFolderName = questFolderName;
        this.specialCallback = specialCallback;
    }
    
    // Public methods
    public drawLogo(renderArea: RenderArea, x: number, y: number, game: Game): void{
        // Draw the logo ascii art
        renderArea.drawArray(Database.getAscii("arena/" + this.questFolderName + "/logo"), x + 1, y + 1);
        
        // Add the button and the link
        renderArea.addMultipleAsciiButtons("theArenaQuest" + this.questFolderName, x + 1, x + 19, y + 1,
                                                                                   x + 1, x + 19, y + 2,
                                                                                   x + 1, x + 19, y + 3,
                                                                                   x + 1, x + 19, y + 4);
        renderArea.addLinkCall(".theArenaQuest" + this.questFolderName, new CallbackCollection(this.launchQuest.bind(this, game)));
    }
    
    // Public getters
    public getQuestFolderName(): string{
        return this.questFolderName;
    }
    
    // Private methods
    private launchQuest(game: Game): void{
        if(game.canStartQuest()){
            game.getStatusBar().selectTabByType(StatusBarTabType.MAP);
            game.goToMap();
            game.setPlace(this.specialCallback(game));
        }
    }
}