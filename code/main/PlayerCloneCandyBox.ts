///<reference path="QuestEntity.ts"/>

class PlayerCloneCandyBox extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A clone", "a clone"),
              new RenderArea(3, 1),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(3, 1))),
              new QuestEntityMovement()
             );
        
        // Set the team
        this.setTeam(QuestEntityTeam.PLAYER);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(quest.getGame().getPlayer().getHp());
        this.setHp(quest.getGame().getPlayer().getHp());
        
        // Set the ascii art and the transparent character
        this.getRenderArea().drawString("\\o/");
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its fists", "its fists"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(5, 3))), 3));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(3);
    }
}