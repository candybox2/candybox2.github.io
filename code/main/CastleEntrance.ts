///<reference path="Quest.ts"/>

class CastleEntrance extends Quest{
    // Last knight added
    private lastKnightAdded: Knight = null;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(149, 30);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, false, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 25));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the walls
        this.addWalls();
        
        // Add the first knight
        this.addKnight(Random.between(80, 120));
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You're trying to cross the castle's entrance."));
    }
    
    // Public methods
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(0, 0), new Pos(60, 20));
    }
    
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        entity.getQuestEntityMovement().setGravity(true);
        entity.getQuestEntityMovement().setWormsLike(true);
    }
    
    public endQuest(win: boolean): void{
        // We add some messages
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You crossed the castle's entrance! You can now enter the castle."));
            Saving.saveBool("mainMapDoneCastleEntrance", true); // The castle entrance is done
        }
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You died trying to cross the castle's entrance."));
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
            
            // Handle monsters
            this.handleKnights();
            
            // Update entities
            this.updateEntities();
        }
        
        // Draw
        this.preDraw();
        this.getRenderArea().drawArray(Database.getAscii("places/quests/castleEntrance/background"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.drawEntities();
        this.getRenderArea().drawArray(Database.getAscii("places/quests/castleEntrance/front"), this.getRealQuestPosition().x + 104, this.getRealQuestPosition().y);
        this.drawAroundQuest();
        if(this.getQuestEnded() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeeping");
        else if(this.getQuestEndedAndWeWon() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeepingBecauseLose");
        else this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addKnight(x: number = 149): void{
        var knight: Knight = new Knight(this, new Pos(x, 20));
        knight.setHealthBar(new QuestEntityHealthBar(knight, new Pos(15, 1)));
        
        if(this.addEntity(knight))
            this.lastKnightAdded = knight;
    }
    
    private addWalls(): void{
        // Create the wall entity
        var wall: Wall = new Wall(this, new Pos(0, 0));
        
        // Add the boxes
        wall.addBox(new Pos(0, 26), new Pos(200, 4));
        wall.addBox(new Pos(104, 6), new Pos(15, 15));
        wall.addBox(new Pos(104, 5), new Pos(16, 1));
        wall.addBox(new Pos(104, 4), new Pos(17, 1));
        wall.addBox(new Pos(106, 3), new Pos(16, 1));
        wall.addBox(new Pos(107, 2), new Pos(6, 1));
        wall.addBox(new Pos(116, 2), new Pos(7, 1));
        
        // Add the wall entity
        this.addEntity(wall);
    }
    
    private handleKnights(): void{
        // If there's no last knight added or the last knight added is weak or on the left of the player, we add a new one
        if(this.lastKnightAdded == null ||
          (this.lastKnightAdded != null && this.lastKnightAdded.getHp()/this.lastKnightAdded.getMaxHp() < 0.4) ||
          (this.lastKnightAdded != null && this.lastKnightAdded.getGlobalPosition().x + 1 < this.getGame().getPlayer().getGlobalPosition().x)
        ){
            this.addKnight();
        }
    }
    
    private thePlayerWon(): boolean{
        // If the player is at the right of the desert, we return true
        if(this.getGame().getPlayer().getGlobalPosition().x >= 149)
            return true;
        
        // Else we return false
        return false;
    }
}
