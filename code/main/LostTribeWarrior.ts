///<reference path="QuestEntity.ts"/>

class LostTribeWarrior extends QuestEntity{
    // Area watched by the warrior
    private watchedAreaPosition: Pos;
    private watchedAreaPosition2: Pos;
    
    // Constructor
    constructor(quest: Quest, pos: Pos, watchedAreaPosition: Pos, watchedAreaPosition2: Pos){
        super(quest,
              pos,
              new Naming("A lost tribe warrior", "a lost tribe warrior"),
              new RenderArea(4, 4),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(1, 1)), new CollisionBox(this, new Pos(0, 1), new Pos(4, 3))),
              new QuestEntityMovement()
             );
        
        // Create the watched area
        this.watchedAreaPosition = watchedAreaPosition;
        this.watchedAreaPosition2 = watchedAreaPosition2;
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        this.getQuestEntityMovement().setWormsLike(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(200);
        this.setHp(200);
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawArray(Database.getAscii("places/quests/theHole/lostTribeWarrior"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("A tribal spear", "a tribal spear"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(6, 6))), 80));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setBetweenDelay(1, 2);
    }
    
    // update()
    public update(): void{
        super.update();
        
        // If the player is inside the watched area
        if(this.playerInsideWatchedArea()){
            // We go towards the player
            this.goTowards(this.getRenderAreaCenter(), this.getQuest().getGame().getPlayer().getRenderAreaCenter());
        }
        // Else
        else{
            // We heal ourselves
            this.heal(1);
        }
    }
    
    // willDie()
    public willDie(): void{
        // Candies
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(3000), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        // The tribal spear
        this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "eqItemWeaponTribalSpear", "You found a tribal spear.", "You gain a tribal spear."));
    }
    
    // Private methods
    private playerInsideWatchedArea(): boolean{
        if(this.getQuest().getGame().getPlayer().getGlobalPosition().x < this.watchedAreaPosition.x)
            return false;
        
        if(this.getQuest().getGame().getPlayer().getGlobalPosition().x > this.watchedAreaPosition2.x)
            return false;
        
        if(this.getQuest().getGame().getPlayer().getGlobalPosition().y < this.watchedAreaPosition.y)
            return false;
        
        if(this.getQuest().getGame().getPlayer().getGlobalPosition().y > this.watchedAreaPosition2.y)
            return false;
        
        // Else, the player is inside : return true
        return true;
    }
}