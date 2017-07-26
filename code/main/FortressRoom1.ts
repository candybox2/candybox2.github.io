///<reference path="Quest.ts"/>

Saving.registerBool("fortressRoom1ChestFound", false);

class FortressRoom1 extends Quest{
    // Did we open the chest?
    private chestOpened: boolean = false;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(208, 31);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 7));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the walls
        this.addWalls();
        
        // Add the spikes
        this.addSpikes(new Spikes(this, new Pos(16, 30), 18));
        this.addSpikes(new Spikes(this, new Pos(43, 30), 4));
        this.addSpikes(new Spikes(this, new Pos(53, 30), 4));
        this.addSpikes(new Spikes(this, new Pos(85, 30), 4));
        this.addSpikes(new Spikes(this, new Pos(161, 30), 12));
        this.addSpikes(new Spikes(this, new Pos(180, 30), 4));
        this.addSpikes(new Spikes(this, new Pos(117, 9), 4));
        this.addSpikes(new Spikes(this, new Pos(121, 14), 4));
        this.addSpikes(new Spikes(this, new Pos(125, 19), 4));
        this.addSpikes(new Spikes(this, new Pos(129, 24), 4));
        
        // Add the xinopherydon
        this.addXinopherydon(new Pos(181, 2));
        
        // Add the chest
        this.addEntity(new Chest(this, new Pos(203, 24), false, new CallbackCollection(this.openChest.bind(this)), Saving.loadBool("fortressRoom1ChestFound")));
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter the first room. It seems tricky."));
    }
    
    // Public methods
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(2, 3), new Pos(1, 1));
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
            Saving.saveBool("fortressRoom1ChestFound", true);
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
        this.getRenderArea().drawArray(Database.getAscii("places/quests/fortress/room1"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.drawEntities();
        this.drawAroundQuest();
        this.addExitQuestButton(new CallbackCollection(this.endQuest.bind(this, true), this.getGame().goToInsideFortress.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addSpikes(spikes: Spikes): void{
        this.addEntity(spikes);
    }
    
    private addWalls(): void{
        // Create the wall entity
        var wall: Wall = new Wall(this, new Pos(0, 0));
        
        // Add the boxes
        wall.addBox(new Pos(0, 0), new Pos(208, 2));
        wall.addBox(new Pos(0, 8), new Pos(15, 1));
        wall.addBox(new Pos(0, 9), new Pos(16, 22));
        wall.addBox(new Pos(34, 2), new Pos(5, 11));
        wall.addBox(new Pos(34, 15), new Pos(9, 16));
        wall.addBox(new Pos(47, 13), new Pos(6, 18));
        wall.addBox(new Pos(57, 11), new Pos(6, 20));
        wall.addBox(new Pos(63, 19), new Pos(22, 12));
        wall.addBox(new Pos(66, 11), new Pos(4, 7));
        wall.addBox(new Pos(74, 11), new Pos(3, 7));
        wall.addBox(new Pos(80, 11), new Pos(5, 7));
        wall.addBox(new Pos(89, 10), new Pos(14, 5));
        wall.addBox(new Pos(89, 15), new Pos(20, 5));
        wall.addBox(new Pos(89, 20), new Pos(26, 5));
        wall.addBox(new Pos(89, 25), new Pos(72, 6));
        wall.addBox(new Pos(106, 10), new Pos(37, 2));
        wall.addBox(new Pos(112, 15), new Pos(31, 2));
        wall.addBox(new Pos(118, 20), new Pos(25, 2));
        wall.addBox(new Pos(200, 2), new Pos(8, 1));
        wall.addBox(new Pos(201, 3), new Pos(7, 4));
        wall.addBox(new Pos(200, 7), new Pos(8, 1));
        wall.addBox(new Pos(157, 8), new Pos(51, 10));
        wall.addBox(new Pos(157, 18), new Pos(25, 1));
        wall.addBox(new Pos(157, 19), new Pos(24, 1));
        wall.addBox(new Pos(157, 20), new Pos(23, 1));
        wall.addBox(new Pos(157, 21), new Pos(22, 1));
        wall.addBox(new Pos(173, 25), new Pos(7, 6));
        wall.addBox(new Pos(184, 23), new Pos(3, 2));
        wall.addBox(new Pos(207, 18), new Pos(1, 6));
        wall.addBox(new Pos(206, 24), new Pos(2, 1));
        wall.addBox(new Pos(184, 25), new Pos(24, 6));
        
        // Add the wall entity
        this.addEntity(wall);
    }
    
    private addXinopherydon(pos: Pos): void{
        var xino: Xinopherydon = new Xinopherydon(this, pos);
        xino.setHealthBar(new QuestEntityHealthBar(xino, new Pos(41, 1), new Pos(158, 2), QuestEntityHealthBarPositionType.FIXED, false, true, BarType.HEALTH));
        this.addEntity(xino);
    }
    
    private openChest(): void{
        this.chestOpened = true;
        this.foundGridOrEqItem(new QuestItemFound(this, "gridItemPossessedUnicornHorn", "You opened a chest and found a unicorn horn!", "You gain a unicorn horn."));
    }
}
