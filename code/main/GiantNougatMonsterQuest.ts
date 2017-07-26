///<reference path="Quest.ts"/>

class GiantNougatMonsterQuest extends Quest{
    // The giant nougat monster
    private giantNougatMonster: GiantNougatMonster;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(100, 20);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 19));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the walls
        this.addWalls();
        
        // Add the monster
        this.addMonster();
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You attack the giant nougat monster. It seems to be asleep."));
    }
    
    // Public methods
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        entity.getQuestEntityMovement().setGravity(true);
        entity.getQuestEntityMovement().setWormsLike(true);
    }
    
    public endQuest(win: boolean): void{
        // We add some messages
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You killed the giant nougat monster and gained access to the tower!"));
            Saving.saveBool("castleKilledNougatMonster", true);
        }
        else this.getGame().getQuestLog().addMessage(new QuestLogMessage("You failed."));
        
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
        if(this.getQuestEnded() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeeping");
        else if(this.getQuestEndedAndWeWon() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeepingBecauseLose");
        else this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addMonster(): void{
        this.giantNougatMonster = new GiantNougatMonster(this, new Pos(78, 16));
        this.giantNougatMonster.setHealthBar(new QuestEntityHealthBar(this.giantNougatMonster, new Pos(100, 1), new Pos(0, 0), QuestEntityHealthBarPositionType.FIXED_ON_PAGE, true, true, BarType.HEALTH));
        this.addEntity(this.giantNougatMonster);
    }
    
    private addWalls(): void{
        // Create the wall entity
        var wall: Wall = new Wall(this, new Pos(-20, 20));
        
        // Add the boxes
        wall.addBox(new Pos(0, 0), new Pos(140, 1));
        
        // Add the wall entity
        this.addEntity(wall);
    }
    
    private thePlayerWon(): boolean{
        if(this.giantNougatMonster.shouldDie())
            return true;
        
        return false;
    }
}
