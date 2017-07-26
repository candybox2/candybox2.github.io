///<reference path="QuestEntity.ts"/>

class MiniShark extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A dangerous fish", "a dangerous fish"),
              new RenderArea(19, 5),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(8, 1), new Pos(2, 1)),
                                         new CollisionBox(this, new Pos(17, 1), new Pos(2, 1)),
                                         new CollisionBox(this, new Pos(5, 2), new Pos(14, 1)),
                                         new CollisionBox(this, new Pos(2, 3), new Pos(17, 1)),
                                         new CollisionBox(this, new Pos(0, 4), new Pos(12, 1)),
                                         new CollisionBox(this, new Pos(18, 4), new Pos(1, 1))
                                        ),
              new QuestEntityMovement(new Pos(-1, 0))
             );
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(70);
        this.setHp(70);
        
        // Set the ascii art
        this.getRenderArea().drawArray(Database.getAscii("places/quests/theSea/miniShark"));
        
        // Set the transparency
        this.setTransparency(new RenderTransparency(" ", "%"));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its teeth", "its teeth"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(21, 7))), 8));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(2);
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(50 + 10*Random.upTo(5)), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
    }
}