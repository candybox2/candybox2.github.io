///<reference path="Quest.ts"/>

Saving.registerBool("fortressRoom3ChestFound", false);

class FortressRoom3 extends Quest{
    // Did we open the chest?
    private chestOpened: boolean = false;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(100, 31);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 30));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the ground
        this.addWalls();
        
        // Add the chest
        this.addEntity(new Chest(this, new Pos(87, 6), false, new CallbackCollection(this.openChest.bind(this)), Saving.loadBool("fortressRoom3ChestFound")));
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter the third room. There's a chest up there. How to reach it?!"));
    }
    
    // Public methods
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(2, 26), new Pos(1, 1));
    }
    
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        entity.getQuestEntityMovement().setGravity(true);
        entity.getQuestEntityMovement().setWormsLike(true);
    }
    
    public endQuest(win: boolean): void{
        // We add some messages
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You exit the room."));
        }
        
        // We call the endQuest method of our mother class
        super.endQuest(win);
        
        // If we won and we opened the chest, we confirm that we found it
        if(win && this.chestOpened){
            Saving.saveBool("fortressRoom3ChestFound", true);
        }
    }
    
    public update(): void{
        if(this.getQuestEnded() == false){
            // Test if the player is dead, if so end the quest (he won) and return
            if(this.getGame().getPlayer().shouldDie()){
                this.endQuest(true); // true because we always win
                return;
            }
            
            // Update entities
            this.updateEntities();
        }
        
        // Draw
        this.preDraw();
        this.getRenderArea().drawArray(Database.getAscii("places/quests/fortress/room3"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.drawEntities();
        this.drawAroundQuest();
        this.addExitQuestButton(new CallbackCollection(this.endQuest.bind(this, true), this.getGame().goToInsideFortress.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addWalls(): void{
        // Create the wall entity
        var wall: Wall = new Wall(this, new Pos(0, 0));
        
        // Add the boxes
        wall.addBox(new Pos(0, 0), new Pos(100, 2));
        wall.addBox(new Pos(0, 2), new Pos(16, 23));
        wall.addBox(new Pos(90, 2), new Pos(10, 1));
        wall.addBox(new Pos(91, 3), new Pos(9, 3));
        wall.addBox(new Pos(90, 6), new Pos(10, 1));
        wall.addBox(new Pos(82, 7), new Pos(18, 24));
        wall.addBox(new Pos(0, 31), new Pos(100, 1));
        
        // Add the wall entity
        this.addEntity(wall);
    }
    
    private openChest(): void{
        this.chestOpened = true;
        this.foundGridOrEqItem(new QuestItemFound(this, "eqItemBootsRocketBoots", "You opened a chest and found rocket boots!", "You gain rocket boots."));
    }
}
