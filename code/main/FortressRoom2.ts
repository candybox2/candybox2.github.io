///<reference path="Quest.ts"/>

class FortressRoom2 extends Quest{
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(100, 17);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 13));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the ground
        this.addWalls();
        
        // Add the chest
        this.addTeapot();
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter the second room. There's a giant teapot in the center."));
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
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You exit the room."));
        }
        
        // We call the endQuest method of our mother class
        super.endQuest(win);
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
        this.getRenderArea().drawArray(Database.getAscii("places/quests/fortress/room2"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
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
        wall.addBox(new Pos(0, 0), new Pos(100, 4));
        wall.addBox(new Pos(96, 4), new Pos(4, 1));
        wall.addBox(new Pos(97, 5), new Pos(3, 8));
        wall.addBox(new Pos(96, 13), new Pos(4, 1));
        wall.addBox(new Pos(0, 14), new Pos(20, 1));
        wall.addBox(new Pos(79, 14), new Pos(21, 1));
        wall.addBox(new Pos(0, 15), new Pos(37, 1));
        wall.addBox(new Pos(59, 15), new Pos(41, 1));
        wall.addBox(new Pos(0, 16), new Pos(100, 1));
        
        // Add the wall entity
        this.addEntity(wall);
    }
    
    private addTeapot(): void{
        var teapot: Teapot = new Teapot(this, new Pos(39, 9));
        teapot.setHealthBar(new QuestEntityHealthBar(teapot, new Pos(96, 1), new Pos(0, 5), QuestEntityHealthBarPositionType.FIXED_ON_PAGE, false, true, BarType.HEALTH));
        this.addEntity(teapot);
    }
}
