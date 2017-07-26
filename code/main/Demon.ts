///<reference path="QuestEntity.ts"/>

class Demon extends QuestEntity{
    // The demon type
    private type: DemonType;
    
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A demon", "a demon"),
              new RenderArea(0, 0),
              new Pos(0, 0),
              new CollisionBoxCollection(),
              new QuestEntityMovement()
             );
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        
        // Set the demon type, randomly-chosen
        switch(Random.between(0, 2)){
            case 0: this.type = DemonType.CUBE; break;
            case 1: this.type = DemonType.EYES; break;
            case 2: this.type = DemonType.BUBBLES; break;
        }
        
        // Depending on the type, resize the render area, add a collision box, and draw the ascii art, and add the weapon and its delay
        switch(this.type){
            case DemonType.CUBE:
                this.getRenderArea().resize(5, 3);
                this.getCbc().addCollisionBox(new CollisionBox(this, new Pos(0, 0), new Pos(5, 3)));
                this.getRenderArea().drawArray(Database.getAscii("places/quests/hell/demonCube"));
                this.setTransparency(new RenderTransparency(" ", "%"));
                this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its huge body", "its huge body"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, 2), new Pos(7, 2))), 50));
                this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(10);
            break;
            case DemonType.EYES:
                this.getRenderArea().resize(5, 4);
                this.getCbc().addCollisionBox(new CollisionBox(this, new Pos(0, 1), new Pos(5, 3)));
                this.getRenderArea().drawArray(Database.getAscii("places/quests/hell/demonEyes"));
                this.setTransparency(new RenderTransparency(" ", "%"));
                this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Demonish eyes", "demonish eyes"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(7, 6))), 10));
                this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(0);
            break;
            case DemonType.BUBBLES:
                this.getRenderArea().resize(5, 3);
                this.getCbc().addCollisionBox(new CollisionBox(this, new Pos(0, 0), new Pos(5, 3)));
                this.getRenderArea().drawArray(Database.getAscii("places/quests/hell/demonBubbles" + Random.between(0, 6).toString()));
                this.setTransparency(new RenderTransparency(" "));
                this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Fire bubbles", "fire bubbles"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(7, 5))), 15));
                this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(1);
            break;
        }
        
        // Set the health points, depending on the type
        switch(this.type){
            case DemonType.CUBE: // Cube : 120 hp
                this.setMaxHp(120);
                this.setHp(120);
            break;
            default: // Default : 30 / 40 / 50 / 60 / 70 / 80 / 90 / 100 hp
                this.setMaxHp(30 + Random.between(0, 7)*10);
                this.setHp(this.getMaxHp());
            break;
        }
    }
    
    // update()
    public update(): void{
        // Try to go towards the player
        this.goTowards(this.getRenderAreaCenter(), this.getQuest().getGame().getPlayer().getRenderAreaCenter(), 0, new Pos(1, 0));
        
        // If we're far from the player, we try to jump
        if(Math.abs(this.getRenderAreaCenter().x - this.getQuest().getGame().getPlayer().getRenderAreaCenter().x) > 5)
            this.jump(3);
        
        // Call the mother class update method
        super.update();
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(5 + Random.upTo(5)), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
}