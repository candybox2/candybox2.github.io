///<reference path="Quest.ts"/>

class Forest extends Quest{
    // Various timers related to monsters handling
    private timeSinceLastWolfAdding: number = 0;
    private timeSinceLastTreeSpiritAdding: number = 40;
    
    // The ground y position
    private groundYPosition: number = 20;
    
    // The mosquito timer (mosquitos will come when the timer reaches 0)
    private mosquitoTimer: number = 250;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(294, this.groundYPosition + 2);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, false, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, this.groundYPosition));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the ground
        this.addGround();
        
        // We add some wolves
        for(var i = 0; i < 10; i++){
            this.addWolf(Random.between(80, 280));
        }
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter the forest."));
    }
    
    // Public methods
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(0, this.groundYPosition), new Pos(10, 1));
    }
    
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        entity.getQuestEntityMovement().setGravity(true);
        entity.getQuestEntityMovement().setWormsLike(false);
    }
    
    public endQuest(win: boolean): void{
        // We add some messages
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You made your way through the forest!"));
            Saving.saveBool("mainMapDoneForest", true); // The desert is done
        }
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You died in the forest. The tree's leaves should soon be covering your body."));
        }
        
        // We call the endQuest method of our mother class
        super.endQuest(win);
    }
    
    public update(): void{
        if(this.getQuestEnded() == false){
            // Test if the player won the quest, if so, end the quest and return
            if(this.thePlayerWon()){
                this.endQuest(true);
                return;
            }
            
            // Test if the player is dead, if so, end the quest and return
            if(this.getGame().getPlayer().shouldDie()){
                this.endQuest(false);
                return;
            }
            
            // Monsters handling
            this.monstersHandling();
            
            // Update entities
            this.updateEntities();
        }
        
        // Draw
        this.preDraw();
        this.getRenderArea().drawArray(Database.getAscii("places/quests/forest/background"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.getRenderArea().drawArray(Database.getAscii("places/quests/forest/background"), this.getRealQuestPosition().x + 98, this.getRealQuestPosition().y);
        this.getRenderArea().drawArray(Database.getAscii("places/quests/forest/background"), this.getRealQuestPosition().x + 98*2, this.getRealQuestPosition().y);
        this.drawEntities();
        this.drawAroundQuest();
        if(this.getQuestEnded() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeeping");
        else if(this.getQuestEndedAndWeWon() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeepingBecauseLose");
        else this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addGround(): void{
        var ground: Wall = new Wall(this, new Pos(0, 0));
        ground.addBox(new Pos(0, this.groundYPosition+1), new Pos(350, 1));
        this.addEntity(ground);
    }
    
    private addMosquito(): boolean{
        return this.addEntity(new Mosquito(this, new Pos(0, this.groundYPosition-Random.between(3, 7)), this.groundYPosition));
    }
    
    private addTreeSpirit(xPosition: number = 294): boolean{ // By default the wolf will be added at the end of the forest
        var treeSpirit: QuestEntity = new TreeSpirit(this, new Pos(xPosition, this.groundYPosition-4), this.groundYPosition);
        treeSpirit.setHealthBar(new QuestEntityHealthBar(treeSpirit, new Pos(5, 1)));
        return this.addEntity(treeSpirit);
    }
    
    private addWolf(xPosition: number = 294): boolean{ // By default the wolf will be added at the end of the forest
        var wolf: QuestEntity = new Wolf(this, new Pos(xPosition, this.groundYPosition-2));
        wolf.setHealthBar(new QuestEntityHealthBar(wolf, new Pos(7, 1)));
        return this.addEntity(wolf);
    }
    
    private monstersHandling(): void{
        // If it's time to add a tree spirit
        if(this.timeSinceLastTreeSpiritAdding > 70 && Random.flipACoin()){
            this.addTreeSpirit(); // We add it
            this.timeSinceLastTreeSpiritAdding = 0; // We reset the timer
        }
        else
            this.timeSinceLastTreeSpiritAdding += 1; // We increase the timer
        
        // If it's time to add a wolf
        if(this.timeSinceLastWolfAdding > 30 && Random.oneChanceOutOf(5)){
            this.addWolf(); // We add it
            this.timeSinceLastWolfAdding = 0; // We reset the timer
        }
        // Else, it's not the time yet
        else
            this.timeSinceLastWolfAdding += 1; // We increase the timer
            
        // If it's time to add a mosquito
        if(this.mosquitoTimer <= 0){
            this.addMosquito();
            this.mosquitoTimer = Random.between(5, 10);
        }
        else this.mosquitoTimer -= 1;
    }
    
    private thePlayerWon(): boolean{
        // If the player is at the right of the desert, we return true
        if(this.getGame().getPlayer().getGlobalPosition().x >= 294)
            return true;
        
        // Else we return false
        return false;
    }
}
