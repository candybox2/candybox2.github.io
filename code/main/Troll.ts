///<reference path="QuestEntity.ts"/>

class Troll extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A troll", "a troll"),
              new RenderArea(15, 10),
              new Pos(0, 0),
              new CollisionBoxCollection(
                  new CollisionBox(this, new Pos(11, 0), new Pos(2, 1)), // Upper part of the bludgeon
                  new CollisionBox(this, new Pos(4, 1), new Pos(3, 3)), // The head
                  new CollisionBox(this, new Pos(9, 1), new Pos(6, 2)), // Main part of the bludgeon
                  new CollisionBox(this, new Pos(0, 4), new Pos(8, 4)), // Main body and right arm
                  new CollisionBox(this, new Pos(2, 8), new Pos(5, 2)), // The legs & feet
                  new CollisionBox(this, new Pos(8, 4), new Pos(4, 2)), // The left arm
                  new CollisionBox(this, new Pos(11, 3), new Pos(2, 4)) // The lowest part of the bludgeon
                  ),
              new QuestEntityMovement()
             );
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(80);
        this.setHp(80);
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawArray(Database.getAscii("places/quests/bridge/troll"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new Bludgeon(this.getQuest(), this, new Naming("Its bludgeon", "its bludgeon"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(17, 11))), 15));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(6);
    }
    
    // Public methods
    public draw(renderArea: RenderArea): void{
        super.draw(renderArea);
        
        // We add the missing "<" on the troll's bludgeon as a tag
        renderArea.addTag(new RenderTagLt(this.getQuest().getRealQuestPosition().x + this.getGlobalPosition().x + this.getRenderAreaPosition().x + 9), this.getQuest().getRealQuestPosition().y + this.getGlobalPosition().y + this.getRenderAreaPosition().y + 1);
    }
    
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(500), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "eqItemWeaponTrollBludgeon", "You picked up the troll's bludgeon from the floor", "You gain the troll's bludgeon"));
    }
}