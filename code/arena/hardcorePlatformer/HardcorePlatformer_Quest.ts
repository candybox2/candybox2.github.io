///<reference path="./../../main/Quest.ts"/>

// -------------------------------
// We register on the Arena module
// -------------------------------

function HardcorePlatformer_getNewQuest(game: Game): Place{
    return new HardcorePlatformer_Quest(game);
}

TheArenaModule.addQuest(new TheArenaModuleQuest("hardcorePlatformer", HardcorePlatformer_getNewQuest.bind(this)));

// -------------------------------------------------------------------------------
// We create our HardcorePlatformer_Quest class, which herits from the Quest class 
// -------------------------------------------------------------------------------

class HardcorePlatformer_Quest extends Quest{
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(240, 13);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, false, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 8));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the ground
        this.addGround();
        
        // Add the spikes
        this.addAllSpikes(this.getGame().getPlayer().getMaxHp()*100);
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("This is going to be HARDCORE."));
    }
    
    // Public methods
    public castPlayerAntiGravityPotion(): void{
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("Damn. These potions don't seem to work here :("));
    }
    
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(0, 8), new Pos(1, 1));
    }
    
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        entity.getQuestEntityMovement().setGravity(true);
        entity.getQuestEntityMovement().setWormsLike(true);
    }
    
    public endQuest(win: boolean): void{
        // We add some messages
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("Yay, you made it!! You can now tell all your friends."));
        }
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You failed. Try again :)"));
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
        this.getRenderArea().drawArray(Database.getAscii("arena/hardcorePlatformer/background"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.drawEntities();
        this.drawAroundQuest();
        this.addExitQuestButton(new CallbackCollection(this.endQuest.bind(this, false), this.getGame().goToMainMap.bind(this.getGame()), this.getGame().getStatusBar().selectTabByType.bind(this.getGame().getStatusBar(), StatusBarTabType.THE_ARENA), this.getGame().goToTheArena.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addAllSpikes(damage: number): void{
        // Add long spikes on the roof (to avoid the usage of rocket boots)
        this.addSpikes(new Spikes(this, new Pos(0, 0), 300, damage, true));
        
        // Add the first group of spikes
        this.addSpikes(new Spikes(this, new Pos(25, 8), 4, damage));
        this.addSpikes(new Spikes(this, new Pos(37, 8), 6, damage));
        this.addSpikes(new Spikes(this, new Pos(49, 8), 6, damage));
        this.addSpikes(new Spikes(this, new Pos(60, 8), 6, damage));
        this.addSpikes(new Spikes(this, new Pos(71, 8), 6, damage));
        
        // Add the second group
        this.addSpikes(new Spikes(this, new Pos(112, 8), 6, damage));
        this.addSpikes(new Spikes(this, new Pos(121, 8), 2, damage));
        this.addSpikes(new Spikes(this, new Pos(127, 8), 2, damage));
        this.addSpikes(new Spikes(this, new Pos(133, 8), 2, damage));
        this.addSpikes(new Spikes(this, new Pos(139, 8), 2, damage));
        
        // Add the third group
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(196, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(198, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(200, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(202, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(204, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(206, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(208, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(210, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(212, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(214, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(216, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(218, 8), 2, damage));
        this.addSpikes(new HardcorePlatformer_Spikes(this, new Pos(220, 8), 2, damage));
        this.addSpikes(new Spikes(this, new Pos(222, 8), 2, damage));
    }
    
    private addGround(): void{
        var wall: Wall = new Wall(this, new Pos(0, 0));
        wall.addBox(new Pos(0, 9), new Pos(240, 3));
        this.addEntity(wall);
    }
    
    private addSpikes(spikes: Spikes): void{
        this.addEntity(spikes);
    }
    
    private thePlayerWon(): boolean{
        // If the player is at the right of the desert, we return true
        if(this.getGame().getPlayer().getGlobalPosition().x >= 240)
            return true;
        
        // Else we return false
        return false;
    }
}
