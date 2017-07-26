///<reference path="Quest.ts"/>

class Hell extends Quest{
    // The devil
    private devil: Devil;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(150, 30);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 23));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the floor
        this.addFloor(0, 20);
        
        // Add the lava entities
        this.addLava(new Pos(53, 27), new Pos(20, 2));
        this.addLava(new Pos(92, 27), new Pos(16, 2));
        
        // Add the devil
        this.addDevil(new Pos(130, 2));
        
        // Add Camazotz
        this.addCamazotz(new Pos(Random.between(70, 100), 2));
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter Hell."));
    }
    
    // Public methods
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(0, 0), new Pos(20, 21));
    }
    
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        entity.getQuestEntityMovement().setGravity(true);
        entity.getQuestEntityMovement().setWormsLike(true);
    }
    
    public endQuest(win: boolean): void{
        // We add some messages
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You managed to beat the devil itself!"));
        }
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You died in Hell. Your soul will wander here for all eternity."));
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
        this.drawBackground(0, 20);
        this.drawEntities();
        this.drawAroundQuest();
        if(this.getQuestEnded() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeeping");
        else if(this.getQuestEndedAndWeWon() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeepingBecauseLose");
        else this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addCamazotz(pos: Pos): void{
        var camazotz: Camazotz;
        camazotz = new Camazotz(this, pos);
        camazotz.setHealthBar(new QuestEntityHealthBar(camazotz, new Pos(22, 1), new Pos(0, 0)));
        this.addEntity(camazotz);
    }
    
    private addDevil(pos: Pos): void{
        this.devil = new Devil(this, pos, 2, 19);
        this.devil.setHealthBar(new QuestEntityHealthBar(this.devil, new Pos(100, 1), new Pos(0, 0), QuestEntityHealthBarPositionType.FIXED_ON_PAGE, true, true, BarType.HEALTH));
        this.addEntity(this.devil);
    }
    
    private addFloor(x: number, y: number): void{
        // Create the wall entity
        var wall: Wall = new Wall(this, new Pos(x, y));
        
        // Add the floor
        wall.addBox(new Pos(0, 4), new Pos(53, 6));
        wall.addBox(new Pos(73, 4), new Pos(19, 6));
        wall.addBox(new Pos(108, 4), new Pos(42, 6));
        wall.addBox(new Pos(0, 9), new Pos(150, 1));
        
        // Add the wall entity
        this.addEntity(wall);
    }
    
    private addLava(pos: Pos, size: Pos): void{
        this.addEntity(new Lava(this, pos, size));
    }
    
    private drawBackground(x: number, y: number): void{
        // Draw the ascii
        this.getRenderArea().drawArray(Database.getAscii("places/quests/hell/background"), this.getRealQuestPosition().x + x, this.getRealQuestPosition().y + y);
        
        // Add the red color for the first lava pit
        this.drawLava(x + 55, x + 71, y + 4);
        this.drawLava(x + 54, x + 72, y + 5);
        this.drawLava(x + 53, x + 73, y + 6);
        this.drawLava(x + 52, x + 74, y + 7);
        this.drawLava(x + 51, x + 75, y + 8);
        this.drawLava(x + 51, x + 75, y + 9);
        
        // Same thing for the second pit
        this.drawLava(x + 94, x + 106, y + 4);
        this.drawLava(x + 93, x + 107, y + 5);
        this.drawLava(x + 92, x + 108, y + 6);
        this.drawLava(x + 91, x + 109, y + 7);
        this.drawLava(x + 90, x + 110, y + 8);
        this.drawLava(x + 90, x + 110, y + 9);
    }
    
    private drawLava(x1: number, x2: number, y: number): void{
        this.getRenderArea().addBackgroundColor(this.getRealQuestPosition().x + x1, this.getRealQuestPosition().x + x2, this.getRealQuestPosition().y + y, new Color(ColorType.HELL_RED_LAVA));
    }
    
    private thePlayerWon(): boolean{
        // If the devil is dead, we return true
        if(this.devil.shouldDie() == true)
            return true;
        
        // Else we return false
        return false;
    }
}
