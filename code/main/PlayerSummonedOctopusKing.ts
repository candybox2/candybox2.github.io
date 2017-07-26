///<reference path="QuestEntity.ts"/>

class PlayerSummonedOctopusKing extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("An Octopus King", "an Octopus King"),
              new RenderArea(6, 4),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(2, 0), new Pos(2, 1)),
                                         new CollisionBox(this, new Pos(1, 1), new Pos(4, 1)),
                                         new CollisionBox(this, new Pos(1, 2), new Pos(4, 1)),
                                         new CollisionBox(this, new Pos(0, 3), new Pos(6, 1))
                                        ),
              new QuestEntityMovement()
             );

        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        this.getQuestEntityMovement().setWormsLike(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(380);
        this.setHp(380);
        
        // Set the team
        this.setTeam(QuestEntityTeam.PLAYER);
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawArray(Database.getAscii("places/quests/octopusKing/octopusKing"));
        this.setTransparency(new RenderTransparency(" "));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its tentacles", "its tentacles"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(8, 6))), 16));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(3);
    }
    
    // update()
    public update(): void{
        // Go towards the player
        this.goTowards(this.getGlobalPosition(), this.getQuest().getGame().getPlayer().getGlobalPosition(), 0, new Pos(1, 0));
        
        // Call the mother class update method
        super.update();
    }
}