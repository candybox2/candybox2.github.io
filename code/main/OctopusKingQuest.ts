///<reference path="Quest.ts"/>

class OctopusKingQuest extends Quest{
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(100, 20);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 17));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the roof and the floor
        this.addRoofAndFloor();
        
        // Add the monkey wizard
        this.addOctopusKing(new Pos(88, 16));
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You challenged the Octopus King. Let the fight begin!"));
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
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You continue to explore the cave."));
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
        this.getRenderArea().drawArray(Database.getAscii("places/quests/octopusKing/roof"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.drawEntities();
        this.drawAroundQuest();
        this.addExitQuestButton(new CallbackCollection(this.endQuest.bind(this, true), this.getGame().goToTheCave.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addOctopusKing(pos: Pos): void{
        var king: OctopusKing = new OctopusKing(this, pos);
        king.setHealthBar(new QuestEntityHealthBar(king, new Pos(100, 1), new Pos(0, 5), QuestEntityHealthBarPositionType.FIXED, false, true, BarType.HEALTH));
        this.addEntity(king);
    }
    
    private addRoofAndFloor(): void{
        // Create the wall entity
        var wall: Wall = new Wall(this, new Pos(0, 0));
        
        // Add the roof
        wall.addBox(new Pos(0, 0), new Pos(100, 2));
        wall.addBox(new Pos(0, 2), new Pos(7, 1));
        wall.addBox(new Pos(18, 2), new Pos(50, 1));
        wall.addBox(new Pos(71, 2), new Pos(29, 1));
        wall.addBox(new Pos(0, 3), new Pos(2, 1));
        wall.addBox(new Pos(24, 3), new Pos(21, 1));
        wall.addBox(new Pos(83, 3), new Pos(17, 1));
        wall.addBox(new Pos(0, 4), new Pos(1, 1));
        wall.addBox(new Pos(99, 4), new Pos(1, 1));
        
        // Add the floor
        wall.addBox(new Pos(-20, 20), new Pos(120, 1));
        
        // Add the wall entity
        this.addEntity(wall);
    }
}
