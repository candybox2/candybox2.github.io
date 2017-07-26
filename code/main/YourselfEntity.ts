///<reference path="QuestEntity.ts"/>

class YourselfEntity extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("Yourself", "yourself"),
              new RenderArea(3, 1),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(3, 1))),
              new QuestEntityMovement(new Pos(-1, 0))
             );
        
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(this.getQuest().getGame().getPlayer().getMaxHp());
        this.setHp(this.getQuest().getGame().getPlayer().getHp());
        
        // Set the ascii art
        this.getRenderArea().drawString("\\o/");
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("The same weapon as yours", "the same weapon as yours"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(5, 3))), 0));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay();
    }
    
    // setHp()
    public setHp(hp: number): void{
        // If we don't have the crown
        if(this.getQuest().getGame().isEquipped("hat", "eqItemHatOctopusKingCrown") == false){
            // When anyone want to change our hp, we change the player's hp first :)
            this.getQuest().getGame().getPlayer().setHp(hp);
        }
        // Else, we have the crown
        else{
            // When anyone want to change our hp, we change the player's hp first :) (but here we keep it over 0!)
            if(hp > 0)
                this.getQuest().getGame().getPlayer().setHp(hp);
            else
                this.getQuest().getGame().getPlayer().setHp(1);
        }
        
        super.setHp(hp);
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(Math.floor(this.getQuest().getGame().getCandies().getCurrent()/10)), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "eqItemBootsBootsOfIntrospection", "You found the boots of introspection", "You gain the boots of introspection"));
    }
}