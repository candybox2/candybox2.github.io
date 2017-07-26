///<reference path="QuestEntitySpell.ts"/>

class ObsidianBrick extends QuestEntitySpell{
    // Constructor
    constructor(quest: Quest, pos: Pos, hp: number){
        super(quest,
              pos,
              new Naming("An obsidian brick", "an obsidian brick"),
              null,
              new Pos(0, 0),
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(2, 1))),
              new QuestEntityMovement()
             );
              
        // Set gravity
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true);
        this.setMaxHp(hp);
        this.setHp(hp);
        
        // Add the color
        this.addColor(new QuestEntitySpellColor(this.getQuest(), new Pos(0, 0), new Pos(2, 1), new Color(ColorType.PLAYER_OBSIDIAN_BRICK)));
    }
}