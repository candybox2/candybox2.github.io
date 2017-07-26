///<reference path="Quest.ts"/>

Saving.registerBool("cellarDone", false);

class Cellar extends Quest{
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(100, 3);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, false, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 2));
        this.getGame().getPlayer().setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        this.getGame().getPlayer().getQuestEntityMovement().setGravity(true);
        this.getGame().getPlayer().getQuestEntityMovement().setWormsLike(false);
        this.addEntity(this.getGame().getPlayer());
        
        // Add the ground
        this.addGround();
        
        // Add the rats
        this.addRats();
        
        // Add a delimiter and the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter the cellar. It's dark and you hear rats squeaking all around you."));
    }
    
    // Public methods
    public endQuest(win: boolean): void{
        // We add some messages
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You managed to kill all the rats!"));
            Saving.saveBool("cellarDone", true);
            
            // We gain the main map
            this.getGame().gainItem("gridItemPossessedMainMap");
        }
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You died in the cellar. Rats are probably going to eat your body."));
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
            
            // Update entities
            this.updateEntities();
        }
        
        // Draw
        this.preDraw();
        this.drawEntities();
        this.drawAroundQuest();
        if(this.getQuestEnded()) this.addExitQuestButton(new CallbackCollection(this.goToFifthHouse.bind(this)), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addGround(): void{
        var wall: Wall = new Wall(this, new Pos(0, this.getRealQuestSize().y));
        wall.addBox(new Pos(0, 0), new Pos(this.getRealQuestSize().x, 1));
        this.addEntity(wall);
    }
    
    private addRat(pos: Pos): void{
        var rat: Rat = new Rat(this, pos);   
        rat.setHealthBar(new QuestEntityHealthBar(rat, new Pos(3, 1)));
        this.addEntity(rat);
    }
    
    private addRats(): void{
        for(var i = 5; i <= 95; i++){
            // One chance out of 3
            if(Random.oneChanceOutOf(3)){
                // We add a rat
                this.addRat(new Pos(i, 2));
                // We increase i to avoid adding a rat above the last one
                i += 2;
            }
        }
    }
    
    private goToFifthHouse(): void{
        this.getGame().setPlace(new FifthHouse(this.getGame()));
    }
    
    private thePlayerWon(): boolean{
        // If the player is at the right of the desert, we return true
        if(this.getGame().getPlayer().getGlobalPosition().x >= 100)
            return true;
        
        // Else we return false
        return false;
    }
}
