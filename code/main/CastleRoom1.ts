///<reference path="Quest.ts"/>

class CastleRoom1 extends Quest{
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(100, 30);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(97, 10));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the walls
        this.addWalls();
        
        // Add the spikes
        this.addEntity(new Spikes(this, new Pos(7, 23), 88));
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter one of the castle's room. Damn, it seems to be full of spikes!"));
    }
    
    // Public methods
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(96, 6), new Pos(2, 3));
    }
    
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(-1, 0)));
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
        this.getRenderArea().drawArray(Database.getAscii("places/quests/castle/room1/background"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.drawEntities();
        this.drawAroundQuest();
        this.addExitQuestButton(new CallbackCollection(this.endQuest.bind(this, true), this.getGame().goToCastle.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addWalls(): void{
        // Create the wall entity
        var wall: Wall = new Wall(this, new Pos(0, 0));
        
        // Add the boxes
        wall.addBox(new Pos(0, 0), new Pos(100, 3));
        wall.addBox(new Pos(0, 3), new Pos(7, 25));
        wall.addBox(new Pos(7, 24), new Pos(93, 4));
        wall.addBox(new Pos(95, 3), new Pos(5, 5));
        wall.addBox(new Pos(95, 11), new Pos(5, 16));
        
        // Add the wall entity
        this.addEntity(wall);
    }
}
