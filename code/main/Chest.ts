///<reference path="QuestEntity.ts"/>

class Chest extends QuestEntity{
    // Callback collection we need to call when the chest is opened
    private callbackCollection: CallbackCollection;
    
    // Are we facing right? (if false, it means we're facing left)
    private isFacingRight: boolean;
    
    // Are we opened?
    private isOpened: boolean;
    
    // The collision box collection used to check if th player is close enough to open the chest
    private openingCollisionBoxCollection: CollisionBoxCollection;
    
    // Constructor
    constructor(quest: Quest, globalPosition: Pos, isFacingRight: boolean = true, callbackCollection: CallbackCollection = new CallbackCollection(), isOpened: boolean = false){
        // Call the mother constructor
        super(quest,
              globalPosition,
              new Naming("A chest", "a chest"),
              new RenderArea(),
              new Pos(0, -1),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, -1), new Pos(3, 2)))
             );
        
        // Set the parameters
        this.isFacingRight = isFacingRight;
        this.callbackCollection = callbackCollection;
        
        // At first, we're not opened
        this.isOpened = isOpened;
        
        // Create the opening collision box collection
        this.openingCollisionBoxCollection = new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(5, 3)));
        
        // Set the team (nature)
        this.setTeam(QuestEntityTeam.NATURE);
        
        // Resize the render area
        this.getRenderArea().resizeFromArray(Database.getAscii("places/quests/common/chestClosed"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Draw for the first time
        this.drawChestAscii();
    }
    
    // update()
    public update(): void{
        super.update();
        
        // If the chest isn't opened yet
        if(this.isOpened == false){
            // If the player has a collision box collection
            if(this.getQuest().getGame().getPlayer().getCbc() != null){
                // If it collides with our opening collision box collection
                if(this.getQuest().getGame().getPlayer().getCbc().collidesWith(this.openingCollisionBoxCollection)){
                    // We are now opened
                    this.isOpened = true;
                    // We fire the callback collection
                    this.callbackCollection.fire();
                    // We re-draw
                    this.drawChestAscii();
                }   
            }
        }
    }
    
    // Private methods
    private drawChestAscii(): void{
        // We erase
        this.getRenderArea().resetAllButSize();
        
        // If we're not opened
        if(this.isOpened == false){
            this.getRenderArea().drawArray(Database.getAscii("places/quests/common/chestClosed"));
        }
        // Else, we're opened
        else{
            // If we're facing right
            if(this.isFacingRight)
                this.getRenderArea().drawArray(Database.getAscii("places/quests/common/chestOpenedRight"));
            // Else we're facing left
            else
                this.getRenderArea().drawArray(Database.getAscii("places/quests/common/chestOpenedLeft"));
        }
    }
}