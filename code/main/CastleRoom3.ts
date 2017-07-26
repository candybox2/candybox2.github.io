///<reference path="Quest.ts"/>

class CastleRoom3 extends Quest{
    // The monster
    private monster: Monster;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(100, 30);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(97, 23));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the walls
        this.addWalls();
        
        // Add the eggs
        this.addEggs();
        
        // Add the monster
        this.addMonster();
        
        // Add the chest
        this.addChest();
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter one of the castle's room."));
    }
    
    // Public methods
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(96, 19), new Pos(2, 3));
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
        this.getRenderArea().drawArray(Database.getAscii("places/quests/castle/room3/background"), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.drawEntities();
        this.drawAroundQuest();
        this.addExitQuestButton(new CallbackCollection(this.endQuest.bind(this, true), this.getGame().goToCastle.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addChest(): void{
        this.addEntity(new Chest(this, new Pos(7, 23), true, new CallbackCollection(this.openChest.bind(this)), Saving.loadBool("gridItemPossessedL")));
    }
    
    private addEggs(): void{
        this.addEntity(new Egg(this, new Pos(16, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(18, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(23, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(25, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(28, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(30, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(38, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(41, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(48, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(52, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(54, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(57, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(63, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(68, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(72, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
        this.addEntity(new Egg(this, new Pos(78, 23), new CallbackCollection(this.anEggDiedCallback.bind(this))));
    }
    
    private addMonster(): void{
        this.monster = new Monster(this, new Pos(67, 3));
        this.addEntity(this.monster);
    }
    
    private addWalls(): void{
        // Create the wall entity
        var wall: Wall = new Wall(this, new Pos(0, 0));
        
        // Add the boxes
        wall.addBox(new Pos(0, 0), new Pos(100, 3));
        wall.addBox(new Pos(0, 3), new Pos(7, 25));
        wall.addBox(new Pos(7, 24), new Pos(93, 4));
        wall.addBox(new Pos(95, 3), new Pos(5, 18));
        
        // Add the wall entity
        this.addEntity(wall);
    }
    
    private anEggDiedCallback(): void{
        // We warn the monster that an egg was destroyed
        this.monster.eggDestroyed();
    }
    
    private openChest(): void{
        this.foundGridOrEqItem(new QuestItemFound(this, "gridItemPossessedL", "You opened a chest and found a strange stone.", "You gain a strange stone."));
    }
}
