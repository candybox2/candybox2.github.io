///<reference path="./../../main/Quest.ts"/>

// -------------------------------
// We register on the Arena module
// -------------------------------

function PeacefulForest_getNewQuest(game: Game): Place{
    return new PeacefulForest_Quest(game);
}

TheArenaModule.addQuest(new TheArenaModuleQuest("peacefulForest", PeacefulForest_getNewQuest.bind(this)));

// ---------------------------------------------------------------------------
// We create our PeacefulForest_Quest class, which herits from the Quest class 
// ---------------------------------------------------------------------------

class PeacefulForest_Quest extends Quest{
    // -----------
    // Constructor
    // -----------

    constructor(game: Game){
        // Call the constructor of our mother class, the Quest class (don't change that)
        super(game);
        
        // Resize the quest
        this.resizeQuest(100, 10); // 100 characters width, 10 characters height
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, false, true, true); // this means that the player will only be able to get out of the quest on the right side
        
        // Handle the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this); // this means that we load the small ("\o/") character, not the big one used in the sea
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 9)); // the player will begin the quest at the x position of 0 and the y position of 9
        this.configPlayerOrClone(this.getGame().getPlayer()); // configure the player (see below in the public methods part)
        this.addEntity(this.getGame().getPlayer()); // finally add the player to the quest
        
        // Add some treeeeees (it uses a private method below)
        this.addATree(12);
        this.addATree(25);
        this.addATree(28);
        this.addATree(35);
        this.addATree(39);
        this.addATree(42);
        this.addATree(48);
        this.addATree(56);
        this.addATree(59);
        this.addATree(65);
        this.addATree(79);
        this.addATree(87);
        this.addATree(91);
        
        // Add a ground because we don't want our trees to fall down (it uses a private method below)
        this.addGround();
        
        // Add the first message in the quest log
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter the peaceful forest. Trees all around you. It's a great place to calm down."));
    }
    
    // --------------
    // Public methods
    // --------------
    
    // Method used to configure the player (called in the constructor)
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0))); // the player is going to the right
        entity.getQuestEntityMovement().setGravity(true); // it is affected by gravity
        entity.getQuestEntityMovement().setWormsLike(false); // the player won't be able to walk over one character high steps (so that it will not walk over trees..)
    }
    
    // Method called by the update method when the quest is over
    public endQuest(win: boolean): void{
        // If we won the quest
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You reached the end of the peaceful forest. It really wasn't too hard."));
        }
        // Else, we didn't win the quest
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You died in the peaceful forest. How did you even manage to do that?"));
        }
        
        // Call the endQuest method of our mother class, the Quest class
        super.endQuest(win);
    }
    
    // Method called automatically ten times per second. It updates everything in the quest
    public update(): void{
        // If the quest isn't finished yet
        if(this.getQuestEnded() == false){            
            // Test if the player won the quest, if so, end the quest and return
            if(this.thePlayerWon()){
                this.endQuest(true); // true = we won
                return;
            }
            
            // Test if the player is dead, if so, end the quest and return
            if(this.getGame().getPlayer().shouldDie()){
                this.endQuest(false); // false = we failed
                return;
            }
            
            // Update entities (it makes everything move, it handles collisions, gravity, damage...)
            this.updateEntities();
        }
        
        // Draw everything
        this.preDraw(); // a special method we need to call before drawing anything
        this.drawEntities(); // draw all entities
        this.drawAroundQuest(); // draw the stuff around (the spells, etc)
        this.addExitQuestButton(new CallbackCollection(this.endQuest.bind(this, false), this.getGame().goToMainMap.bind(this.getGame()), this.getGame().getStatusBar().selectTabByType.bind(this.getGame().getStatusBar(), StatusBarTabType.THE_ARENA), this.getGame().goToTheArena.bind(this.getGame())), "buttonExitQuestKeeping"); // draw the button to exit the quest
        this.postDraw(); // a special method we need to call after drawing everything
    }
    
    // --------------
    // Public methods
    // --------------
    
    // Method called in the constructor. It is used to add a tree at a given x position.
    private addATree(x: number): void{
        // Create the tree
        var tree: QuestEntity = new PeacefulForest_Tree(this, new Pos(x, 9)); // We use the x position given in parameter, the y position match the ground's position
        
        // Set the tree's health bar
        tree.setHealthBar(new QuestEntityHealthBar(tree, new Pos(3, 1))); // 3 characters width, 1 character height
        
        // Finally add the tree to the quest
        this.addEntity(tree);
    }
    
    // Method called in the constructor. It is used to add a ground to the quest, therefore preventing the trees to fall down.
    private addGround(): void{
        // Create the ground entity
        var ground: Wall = new Wall(this, new Pos(0, 10)); // position 0, 10
        
        // Add the ground box (100 characters width, 1 character height)
        ground.addBox(new Pos(0, 0), new Pos(100, 1));
        
        // Add the ground entity
        this.addEntity(ground);
    }

    // Method called by the update method above to know if the player won the quest
    private thePlayerWon(): boolean{
        // If the player reached the right limit of the quest, we return true because he won the quest
        if(this.getGame().getPlayer().getGlobalPosition().x >= 100)
            return true;
        
        // Else we return false
        return false;
    }
}
