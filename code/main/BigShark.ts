///<reference path="QuestEntity.ts"/>

class BigShark extends QuestEntity{
    // Do we have a special fin?
    private finType: BigSharkFinType;
    
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos,
              new Naming("A shark", "a shark"),
              new RenderArea(47, 10),
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(14, 0), new Pos(2, 1)),
                                         new CollisionBox(this, new Pos(13, 1), new Pos(2, 1)),
                                         new CollisionBox(this, new Pos(12, 2), new Pos(4, 1)),
                                         new CollisionBox(this, new Pos(41, 2), new Pos(5, 1)),
                                         new CollisionBox(this, new Pos(11, 3), new Pos(7, 1)),
                                         new CollisionBox(this, new Pos(35, 3), new Pos(11, 1)),
                                         new CollisionBox(this, new Pos(2, 4), new Pos(40, 1)),
                                         new CollisionBox(this, new Pos(0, 5), new Pos(40, 1)),
                                         new CollisionBox(this, new Pos(1, 6), new Pos(44, 1)),
                                         new CollisionBox(this, new Pos(3, 7), new Pos(43, 1)),
                                         new CollisionBox(this, new Pos(15, 8), new Pos(3, 1)),
                                         new CollisionBox(this, new Pos(16, 9), new Pos(1, 1))
                                        ),
              new QuestEntityMovement(new Pos(-1, 0))
             );
        
        // By default, finType is null
        this.finType = null;
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(200);
        this.setHp(200);
        
        // Set the ascii art
        this.getRenderArea().drawArray(Database.getAscii("places/quests/theSea/bigShark"));
        
        // Set the transparency
        this.setTransparency(new RenderTransparency(" ", "%"));
        
        // Set the weapon and its delay
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, new Naming("Its sharp teeth", "its sharp teeth"), new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(49, 12))), Random.between(30, 42)));
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(1);
    }
    
    // draw()
    public draw(renderArea: RenderArea): void{
        // Mother class draw method
        super.draw(renderArea);
        
        // Add the fin color if we have a special fin type
        if(this.finType != null){
            switch(this.finType){
                case BigSharkFinType.RED:
                    this.drawFinColor(renderArea, ColorType.BIGSHARK_FIN_RED);
                break;
                case BigSharkFinType.GREEN:
                    this.drawFinColor(renderArea, ColorType.BIGSHARK_FIN_GREEN);
                break;
                case BigSharkFinType.PURPLE:
                    this.drawFinColor(renderArea, ColorType.BIGSHARK_FIN_PURPLE);
                break;
            }
        }
    }
    
    // willDie()
    public willDie(): void{
        this.getQuest().getGame().getQuestLog().addMessage(new QuestLogMessage(this.getDeathMessage() + " (and found " + Algo.pluralFormat(this.getQuest().foundCandies(500 + Random.upTo(30)*35), " candy", " candies") + ")", this.getQuest().getCandiesFoundMessage()));
        
        if(this.finType != null){
            switch(this.finType){
                case BigSharkFinType.RED:
                    this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "gridItemPossessedRedSharkFin", "You found a red shark fin", "You gain a red shark fin"));
                break;
                case BigSharkFinType.GREEN:
                    this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "gridItemPossessedGreenSharkFin", "You found a green shark fin", "You gain a green shark fin"));
                break;
                case BigSharkFinType.PURPLE:
                    this.getQuest().foundGridOrEqItem(new QuestItemFound(this.getQuest(), "gridItemPossessedPurpleSharkFin", "You found a purple shark fin", "You gain a purple shark fin"));
                break;
            }
        }
    }
    
    // Public methods
    public hasFin(finType: BigSharkFinType): void{
        this.finType = finType;
    }
    
    // Private methods
    private drawFinColor(renderArea: RenderArea, colorType: ColorType): void{
        // If the fin color wouldn't be outside of the quest
        if(this.getGlobalPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 11 >= 0 &&
           this.getGlobalPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 18 <= 99){
            // We draw it
            renderArea.addBackgroundColor(this.getGlobalPosition().x + this.getQuest().getRealQuestPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 14, this.getGlobalPosition().x + this.getQuest().getRealQuestPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 15, this.getGlobalPosition().y + this.getQuest().getRealQuestPosition().y + this.getRenderAreaPosition().y + this.getQuest().getGlobalDrawingOffset().y + 0, new Color(colorType));
            renderArea.addBackgroundColor(this.getGlobalPosition().x + this.getQuest().getRealQuestPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 13, this.getGlobalPosition().x + this.getQuest().getRealQuestPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 15, this.getGlobalPosition().y + this.getQuest().getRealQuestPosition().y + this.getRenderAreaPosition().y + this.getQuest().getGlobalDrawingOffset().y + 1, new Color(colorType));
            renderArea.addBackgroundColor(this.getGlobalPosition().x + this.getQuest().getRealQuestPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 12, this.getGlobalPosition().x + this.getQuest().getRealQuestPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 16, this.getGlobalPosition().y + this.getQuest().getRealQuestPosition().y + this.getRenderAreaPosition().y + this.getQuest().getGlobalDrawingOffset().y + 2, new Color(colorType));
            renderArea.addBackgroundColor(this.getGlobalPosition().x + this.getQuest().getRealQuestPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 11, this.getGlobalPosition().x + this.getQuest().getRealQuestPosition().x + this.getRenderAreaPosition().x + this.getQuest().getGlobalDrawingOffset().x + 18, this.getGlobalPosition().y + this.getQuest().getRealQuestPosition().y + this.getRenderAreaPosition().y + this.getQuest().getGlobalDrawingOffset().y + 3, new Color(colorType));
        }
    }
}