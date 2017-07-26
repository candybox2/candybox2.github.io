///<reference path="Quest.ts"/>

class Desert extends Quest{
    // Bird adding variables
    currentBirdTime: number;
    nextBirdAt: number;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize the quest
        this.resizeQuest(149, 30);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, false, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 26));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the ground
        this.addGround(
            0, 3, 1, // From x = 0 to x = 3, the ground will start at y = 1
            4, 12, 0, // From x = 4 to x = 12, the ground will start at y = 0
            13, 18, 1, // Etc
            19, 24, 2,
            25, 30, 3,
            31, 36, 2,
            37, 42, 1,
            43, 51, 0,
            52, 57, 1,
            58, 62, 2,
            63, 68, 3,
            69, 75, 2,
            76, 82, 1,
            83, 92, 0,
            93, 97, 1,
            98, 101, 2,
            102, 107, 3,
            108, 113, 2,
            114, 119, 1,
            120, 128, 0,
            129, 134, 1,
            135, 139, 2,
            140, 145, 3,
            146, 148, 2
        );
        
        // Bird adding stuff
        this.currentBirdTime = 0;
        this.setNextBirdAt();
        
        // Add the camels
        this.addCamel(new Pos(44, 24));
        this.addCamel(new Pos(65, 26));
        this.addCamel(new Pos(84, 24));
        this.addCamel(new Pos(106, 26));
        this.addCamel(new Pos(118, 24));
        this.addCamel(new Pos(144, 26));
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You enter the desert, camels and palm trees as far as the eye can see."));
    }
    
    // Public methods
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        entity.getQuestEntityMovement().setGravity(true);
        entity.getQuestEntityMovement().setWormsLike(true);
    }
    
    public endQuest(win: boolean): void{
        // We add some messages
        if(win){
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You made your way through the desert!"));
            Saving.saveBool("mainMapDoneDesert", true); // The desert is done
        }
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You died in the desert. Alone."));
        }
        
        // We call the endQuest method of our mother class
        super.endQuest(win);
    }
    
    public update(): void{
        if(this.getQuestEnded() == false){
            // Possibly add a bird
            if(this.currentBirdTime >= this.nextBirdAt){
                this.currentBirdTime = 0;
                this.setNextBirdAt();
                this.addBird();
            }
            else this.currentBirdTime += 1;
            
            // Test if the player won the quest, if so, end the quest and return
            if(this.thePlayerWon()){
                this.endQuest(true);
                return;
            }
            
            // Test if the player is dead, if so, end the quest and return
            if(this.getGame().getPlayer().shouldDie()){
                this.endQuest(false);
                return;
            }
            
            // Update entities
            this.updateEntities();
        }
        
        // Draw
        this.preDraw();
        this.getRenderArea().drawArray(Database.getAscii("places/quests/desert/background"), this.getRealQuestPosition().x, this.getRealQuestPosition().y + 21);
        this.drawEntities();
        this.drawAroundQuest();
        if(this.getQuestEnded() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeeping");
        else if(this.getQuestEndedAndWeWon() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeepingBecauseLose");
        else this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addBird(): void{
        // We create the variable which will contain our bird
        var bird: DesertBird;
        
        // We choose the y position of our bird
        var yPos: number = Random.upTo(14);
        
        // We check if we could collide with another bird using this y position
        for(var i = 0; i < this.getEntities().length; i++){
            if(this.getEntities()[i].getCbc() != null && this.getEntities()[i].getCbc().collidesWith(new CollisionBoxCollection(new CollisionBox(new QuestEntity(this, new Pos(0, 0)), new Pos(0, yPos), new Pos(149, 4)))))
                return;
        }
        
        // We add a bird going right
        if(Random.flipACoin()){
            bird = new DesertBird(this, new Pos(-9, yPos), true);
        }
        // Or a bird going left
        else{
            bird = new DesertBird(this, new Pos(149, yPos), false);
        }
        
        // We add the health bar and finally add the bird to the entities
        bird.setHealthBar(new QuestEntityHealthBar(bird, new Pos(9, 1)));
        this.addEntity(bird);
    }
    
    private addCamel(pos: Pos): void{
        var camel: QuestEntity;
        
        if(Random.oneChanceOutOf(20))
            camel = new TripodCamel(this, pos);
        else
            camel = new Camel(this, pos);
        
        camel.setHealthBar(new QuestEntityHealthBar(camel, new Pos(7, 1)));
        this.addEntity(camel);
    }
    
    private addGround(...positions: number[]): void{
        // Create the wall entity
        this.addEntity(new Wall(this, new Pos(0, 26)));
        var wall: Wall = <Wall>(this.getLastEntity());
        
        // Add the boxes
        for(var i = 0; i < positions.length/3; i++){
            wall.addBox(new Pos(positions[i*3], positions[i*3+2]), new Pos(positions[i*3+1] - positions[i*3] + 1, 4-positions[i*3+2]));
        }
    }
    
    private setNextBirdAt(): void{
        this.nextBirdAt = 20 + Random.upTo(30);
    }
    
    private thePlayerWon(): boolean{
        // If the player is at the right of the desert, we return true
        if(this.getGame().getPlayer().getGlobalPosition().x >= 149)
            return true;
        
        // Else we return false
        return false;
    }
}
