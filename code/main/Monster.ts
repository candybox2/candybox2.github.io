///<reference path="QuestEntity.ts"/>

class Monster extends QuestEntity{
    // Was an egg destroyed yet?
    private anEggWasDestroyed: boolean;
    
    // Constructor
    constructor(quest: Quest, globalPosition: Pos){
        // Call the mother constructor
        super(quest,
              globalPosition,
              new Naming("The monster", "the monster"),
              new RenderArea(13, 4),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(13, 1)),
                                         new CollisionBox(this, new Pos(1, 0), new Pos(11, 1)),
                                         new CollisionBox(this, new Pos(2, 0), new Pos(9, 1)),
                                         new CollisionBox(this, new Pos(3, 0), new Pos(7, 1))),
              new QuestEntityMovement()
             );
        
        // At first, no egg was destroyed
        this.anEggWasDestroyed = false;
        
        // Set the ascii art
        this.getRenderArea().drawArray(Database.getAscii("places/quests/castle/room3/monster"));
        this.setTransparency(new RenderTransparency(" ", "%"));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("??", "??"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(15, 6))), 10000));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(0);
    }
    
    // update()
    public update(): void{
        // If no egg was destroyed, we go towards the player but we stay on the roof
        if(this.anEggWasDestroyed == false){
            this.goTowards(this.getGlobalPosition().plus(new Pos(6, 4)), this.getQuest().getGame().getPlayer().getGlobalPosition().plus(new Pos(1, 0)), 0, new Pos(2, 0), true);
        }
        // Else, we go down on the player
        else{
            this.goTowards(this.getGlobalPosition().plus(new Pos(6, 4)), this.getQuest().getGame().getPlayer().getGlobalPosition().plus(new Pos(1, 0)), 0, new Pos(4, 4));
        }
        
        // Call the mother classe update
        super.update();
    }
    
    // Public methods
    public eggDestroyed(): void{
        this.anEggWasDestroyed = true;
    }
}