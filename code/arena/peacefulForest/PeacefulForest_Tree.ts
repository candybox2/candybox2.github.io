///<reference path="../../main/QuestEntity.ts"/>

class PeacefulForest_Tree extends QuestEntity{
    // Constructor
    constructor(quest: Quest, pos: Pos){
        super(quest,
              pos, // The global position of the tree in the quest. We use the value given in parameter.
              new Naming("A tree", "a tree"), // The name of the entity as it will appear in the quest log. Two parameters : the first one ("A tree") is used at the beginning of a sentence, and the second one ("a tree") is used inside a sentence
              new RenderArea(3, 1), // The tree render area : 3 characters width and 1 character height
              new Pos(0, 0), // The position of where the render area is drawn relatively to the global position (see three lines above)
              new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(3, 1))), // The collision box collection of the tree, made of one collision box (position 0, 0, size 3, 1)
              new QuestEntityMovement() // The tree's movement. We don't give any parameter because the tree isn't actually moving.
             );
        
        // Set gravity : the tree can fall (even if it probably won't because it lays on the ground)
        this.getQuestEntityMovement().setGravity(true);
        
        // Set destructible
        this.setDestructible(true); // The tree will be destructible
        this.setMaxHp(50); // Set the maximum health points
        this.setHp(50); // Set the health points
        
        // Set the ascii art
        this.getRenderArea().drawString("|||", 0, 0); // Draw the tree ("|||") on the render area
        
        // Add the tree's weapon. It will be attacking with its leaves.
        this.addQuestEntityWeapon(new QuestEntityWeapon(this.getQuest(), this, // Nothing important here
                                                        new Naming("Its leaves", "its leaves"), // The weapon's name
                                                        new CollisionBoxCollection(new CollisionBox(this, new Pos(-1, -1), new Pos(5, 2))), // The tree collision box collection, made of one collision box (position -1, -1, size 5, 2)
                                                        1)); // The weapon's damage (1)
        
        // Set the weapon's delay
        this.getLastQuestEntityWeapon().getCloseCombatDelay().setFixedDelay(5); // This means the tree will inflict damage every 5 seconds
    }
}