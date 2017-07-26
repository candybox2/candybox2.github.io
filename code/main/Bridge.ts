///<reference path="Quest.ts"/>

class Bridge extends Quest{
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(138, 32);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, false, false, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 17));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add a wall at the bridge position
        this.addBridgeFloor();
        
        // Add the troll
        this.addTroll();
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You're trying to cross the bridge. A huge troll is blocking your way!"));
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
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You managed to cross the bridge!"));
            Saving.saveBool("mainMapDoneBridge", true); // The bridge is done
        }
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You didn't manage to cross the bridge."));
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
        this.getRenderArea().drawArray(Database.getAscii("places/quests/bridge/bridge"), this.getRealQuestPosition().x, this.getRealQuestPosition().y + 17);
        this.drawEntities();
        this.drawAroundQuest();
        if(this.getQuestEnded() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeeping");
        else if(this.getQuestEndedAndWeWon() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeepingBecauseLose");
        else this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addBridgeFloor(): void{
        // Create the wall
        var wall: Wall = new Wall(this, new Pos(0, 18));
        
        // Add boxes
        wall.addBox(new Pos(0, 0), new Pos(138, 2));
        wall.addBox(new Pos(3, 2), new Pos(10, 1));
        wall.addBox(new Pos(6, 3), new Pos(4, 11));
        wall.addBox(new Pos(64, 2), new Pos(10, 1));
        wall.addBox(new Pos(67, 3), new Pos(4, 11));
        wall.addBox(new Pos(126, 2), new Pos(10, 1));
        wall.addBox(new Pos(129, 3), new Pos(4, 11));
        
        // Add the wall to the quest
        this.addEntity(wall);
    }
    
    private addTroll(): void{
        var troll: Troll = new Troll(this, new Pos(100, 8));
        troll.setQuestEntityMovement(new QuestEntityMovement(new Pos(-1, 0), 12));
        troll.setHealthBar(new QuestEntityHealthBar(troll, new Pos(100, 1), new Pos(0, 0), QuestEntityHealthBarPositionType.FIXED_ON_PAGE, true, true, BarType.HEALTH));
        this.addEntity(troll);
    }
    
    private thePlayerWon(): boolean{
        // If the player is at the right of the desert, we return true
        if(this.getGame().getPlayer().getGlobalPosition().x >= 138)
            return true;
        
        // Else we return false
        return false;
    }
}
