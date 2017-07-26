///<reference path="QuestEntity.ts"/>

class Xinopherydon extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A xinopherydon", "a xinopherydon"),
              new RenderArea(17, 6),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 1), new Pos(5, 1)),
                                         new CollisionBox(this, new Pos(0, 2), new Pos(9, 1)),
                                         new CollisionBox(this, new Pos(12, 2), new Pos(5, 1)),
                                         new CollisionBox(this, new Pos(3, 3), new Pos(14, 1)),
                                         new CollisionBox(this, new Pos(4, 4), new Pos(5, 1)),
                                         new CollisionBox(this, new Pos(10, 4), new Pos(5, 1)),
                                         new CollisionBox(this, new Pos(5, 5), new Pos(3, 1)),
                                         new CollisionBox(this, new Pos(11, 5), new Pos(3, 1))
                                        ),
              new QuestEntityMovement()
             );
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        this.getQuestEntityMovement().setWormsLike(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(5000);
        this.setHp(5000);
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawArray(Database.getAscii("places/quests/fortress/xinopherydon"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its huge body", "its huge body"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(19, 8))), 800));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(20);
    }
    
    // update()
    public update(): void{
        super.update();
        
        console.log(this.getHp());

        // We heal ourselves if the player is too far on the left
        if(this.getQuest().getGame().getPlayer().getGlobalPosition().x < this.getGlobalPosition().x - 50) this.heal(50);
    }
    
    // willDie()
    public willDie(): void{
        // Candies
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(30000), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        // The claw
        this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "gridItemPossessedXinopherydonClaw", "You found a strange claw on the xinopherydon's corpse.", "You gain a strange claw."));
    }
}