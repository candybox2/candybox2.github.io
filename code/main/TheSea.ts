///<reference path="Quest.ts"/>

class TheSea extends Quest{
    // Floors
    private floors: TheSeaFloor[] = [];
    
    // Generation projection (how many characters the player doesn't already see should we generate)
    private generationProjection: number = 10;
    
    // The distance we've swimed so far
    private distance: number = 0;
    
    // Min and max floor height
    private floorMinHeight: number = 3;
    private floorMaxHeight: number = 8;
    
    // Patterns stuff
    private currentPattern: TheSeaPattern = null;
    private currentPatternLevel: TheSeaPatternLevel = null;
    
    // Last player movement
    private lastPlayerMovement: Pos = new Pos(0, 0);
    
    // Did we already generate a sponge? Shell powder?
    private spongeGenerated: boolean = false;
    private shellPowderGenerated: boolean = false;
    
    // Constructor
    constructor(game: Game){
        super(game, "You can move with the down and up arrow keys!");
        
        // Resize the quest
        this.resizeQuest(100, 30);
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, false, true, true);
        
        // Gravity is disabled
        this.setGravityDisabled(true);
        this.setWormsLikeDisabled(true);
        
        // Add the player
        this.getGame().getPlayer().loadMediumCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(0, 5));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Fill the floors array with null values
        for(var i = 0; i <= 99 + this.generationProjection; i++){
            this.floors.push(null);
        }
        
        // Generate for the first time
        this.generate(0, 99 + this.generationProjection);
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You jump into the sea! You know you could find precious hidden treasures in the depths..."));
    }
    
    // willBeDisplayed()
    public willBeDisplayed(): void{
        // We call the mother willBeDisplayed()
        super.willBeDisplayed();
        
        // Register hotkeys so that they can't be used by the player's browser
        this.getGame().addHotkey(new Hotkey("up", null));
        this.getGame().addHotkey(new Hotkey("down", null));
    }
    
    // Public methods
    public addBigShark(pos: Pos): BigShark{
        var bigShark: BigShark = new BigShark(this, pos);
        bigShark.setHealthBar(new QuestEntityHealthBar(bigShark, new Pos(47, 1)));
        if(this.addEntity(bigShark)) // If we manage to add the entity
            return bigShark; // We return it
        return null; // Else, we return null
    }
    
    public addJellyFish(pos: Pos): JellyFish{
        var jellyFish: JellyFish = new JellyFish(this, pos);
        jellyFish.setHealthBar(new QuestEntityHealthBar(jellyFish, new Pos(6, 1), new Pos(0, 0)));
        if(this.addEntity(jellyFish)) // If we manage to add the entity
            return jellyFish; // We return it
        return null; // Else, we return null
    }
    
    public addMediumFish(pos: Pos): MediumFish{
        var mediumFish: MediumFish = new MediumFish(this, pos);
        mediumFish.setHealthBar(new QuestEntityHealthBar(mediumFish, new Pos(8, 1), new Pos(0, 0)));
        if(this.addEntity(mediumFish)) // If we manage to add the entity
            return mediumFish; // We return it
        return null; // Else, we return null
    }
    
    public addMiniShark(pos: Pos): MiniShark{
        var miniShark: MiniShark = new MiniShark(this, pos);
        miniShark.setHealthBar(new QuestEntityHealthBar(miniShark, new Pos(19, 1)));
        if(this.addEntity(miniShark)) // If we manage to add the entity
            return miniShark; // We return it
        return null; // Else, we return null
    }
    
    public addSeahorse(pos: Pos, intendedXPosition: number): Seahorse{
        var seahorse: Seahorse = new Seahorse(this, pos, intendedXPosition);
        seahorse.setHealthBar(new QuestEntityHealthBar(seahorse, new Pos(4, 1)));
        if(this.addEntity(seahorse)) // If we manage to add the entity
            return seahorse; // We return it
        return null; // Else, we return null
    }
    
    public addSeaSnake(pos: Pos): SeaSnake{
        var seaSnake: SeaSnake = new SeaSnake(this, pos);
        if(this.addEntity(seaSnake)) // If we did manage to add the entity
            return seaSnake; // We return it
        return null; // Else we return null
    }
    
    public addSmallestFish(pos: Pos): SmallestFish{
        var smallestFish: SmallestFish = new SmallestFish(this, pos);
        smallestFish.setHealthBar(new QuestEntityHealthBar(smallestFish, new Pos(3, 1)));
        if(this.addEntity(smallestFish)) // If we manage to add the entity
            return smallestFish; // We return it
        return null; // Else, we return null
    }
    
    public castJump(){} // We can't jump in the sea !
    
    public castPlayerAcidRain(): void{
        // We cast from 0 to 100, not strictly around the player as usual
        super.castPlayerAcidRain(null, null, 0, 100);
    }
    
    public castPlayerTeleport(): void{
        // We teleport, be we stay on the left side of the quest
        super.castPlayerTeleport(new Pos(0, 0), new Pos(0, this.getRealQuestSize().y-1));
    }
    
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement(new Pos(1, 0)));
        entity.getQuestEntityMovement().setGravity(false);
        entity.getQuestEntityMovement().setWormsLike(false);
    }
    
    public endQuest(win: boolean): void{
        // Variable used to generate the winning message
        var comment: string;
        
        // We add some messages
        if(win){
            switch(Random.between(0, 8)){
                case 0: comment = "by jumping on a jellyfish"; break;
                case 1: comment = "by hanging onto a sea turtle"; break;
                case 2: comment = "by following a dolphin"; break;
                case 3: comment = "(you don't know how)"; break;
                case 4: comment = "by hanging onto a shark's fin"; break;
                case 5: comment = "by following a whale"; break;
                case 6: comment = "by following a squid"; break;
                case 7: comment = "by asking your way to a shrimp"; break;
                case 8: comment = "thanks to some updrafts"; break;
            }
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You almost died in the sea but managed to get to the surface in time " + comment + "."));
        }
        else{
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You died in the sea."));
        }
        
        // We call the endQuest method of our mother class
        super.endQuest(win);
    }
    
    // getLeftLimit()
    public getLeftLimit(): number{
        return 100;
    }
    
    public update(): void{
        if(this.getQuestEnded() == false){
            // Test if the player is dead, if so, end the quest (he won!!) and return
            if(this.getGame().getPlayer().shouldDie()){
                this.endQuest(true); // true because we always win
                return;
            }
            
            // Add some enemies
            this.handlePatterns(100, 115);
            
            // Move the player vertically
            this.moveVertically();
            
            // Update entities
            this.updateEntities();
            
            // Force scrolling of everything
            this.globalScrolling();
        }
        
        // Draw
        this.preDraw();
        this.drawSea();
        this.drawEntities();
        this.drawAroundQuest();
        this.addExitQuestButton(new CallbackCollection(this.endQuest.bind(this, true), this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Public getters
    public getDistance(): number{
        return this.distance;
    }
    
    public getFloorMaxHeight(): number{
        return this.floorMaxHeight;
    }
    
    public getFloorMinHeight(): number{
        return this.floorMinHeight;
    }
    
    public getLastPlayerMovement(): Pos{
        return this.lastPlayerMovement;
    }
    
    public getRightLimit(): number{
        return 70;
    }
    
    // Private methods    
    private addFloor(index: number, type: TheSeaFloorType, height: number, previousFloor: TheSeaFloor = null): void{
        // Add the floor
        this.floors[index] = new TheSeaFloor(type, height, previousFloor);
        
        // If the type is normal
        if(type == TheSeaFloorType.NORMAL)
            this.addFloorCollisionBox(new Pos(index, this.getRealQuestSize().y - (height - 1)), new Pos(1, height - 1)); // Add a floor collision box at height - 1
        else
            this.addFloorCollisionBox(new Pos(index, this.getRealQuestSize().y - height), new Pos(1, height)); // Add a floor collision box at height
            
    }
    
    private addFloorCollisionBox(pos: Pos, size: Pos): void{
        var wall: Wall = new Wall(this, pos);
        wall.addBox(new Pos(0, 0), size);
        this.addEntity(wall);
    }
    
    private drawFloors(): void{
        for(var i = 0; i <= 99; i++){
            if(this.floors[i] != null){
                this.floors[i].draw(this.getRenderArea(), this.getRealQuestPosition().y + this.getRealQuestSize().y, i);
            }
        }
    }
    
    private drawSea(): void{
        this.drawFloors();
    }
    
    private generate(x1: number, x2: number): void{
        this.generateFloors(x1, x2);
        this.generateShellPowder(x1, x2);
        this.generateSponge(x1, x2);
        this.generatePlants(x1, x2);
    }
    
    private generateFloors(x1: number, x2: number): void{
        // Create variables which will be useful
        var type: TheSeaFloorType;
        
        for(var i = x1; i <= x2; i++){
            // If we're placing the first floor
            if(i == 0){
                // We place it at a random height and with the normal type
                this.addFloor(i, TheSeaFloorType.NORMAL, Random.between(this.floorMinHeight, this.floorMaxHeight));
            }
            // Else, we're not placing the first floor
            else{
                // Init the variables
                type = null;
                
                // If we want to keep the same type and it's possible to do so
                if(Random.oneChanceOutOf(15 - this.floors[i-1].getHowManyFloorsOfTheSameTypeBefore()) == false && (
                   (this.floors[i-1].getType() == TheSeaFloorType.NORMAL) || // We want to keep a normal type : no problem
                   (this.floors[i-1].getType() == TheSeaFloorType.GOING_DOWN && this.floors[i-1].getHeight() > this.floorMinHeight) || // We want to keep going down and we're not too low : no problem
                   (this.floors[i-1].getType() == TheSeaFloorType.GOING_UP && this.floors[i-1].getHeight() < this.floorMaxHeight) // We want to keep going up and we're not too high : no problem
                )){
                    // We will keep the same type as the previous floor
                    type = this.floors[i-1].getType();
                }
                // Else, we want to change the type
                else{
                    // If the previous floor has a normal type
                    if(this.floors[i-1].getType() == TheSeaFloorType.NORMAL){
                        if(this.floors[i-1].getHeight() == this.floorMinHeight) type = TheSeaFloorType.GOING_UP; // If the previous floor was too low, we must go up
                        else if(this.floors[i-1].getHeight() >= this.floorMaxHeight-1) type = TheSeaFloorType.GOING_DOWN; // If the previous floor was too high, we must go down
                        else{
                            // Else, we pick randomly the new type
                            if(Random.flipACoin()) type = TheSeaFloorType.GOING_UP;
                            else type = TheSeaFloorType.GOING_DOWN;
                        }
                    }
                    // Else, we must choose the normal type
                    else{
                        type = TheSeaFloorType.NORMAL;
                    }
                }
                
                // Create the floor from the type decided before
                switch(type){
                    case TheSeaFloorType.NORMAL: // Normal type : height + 1 if up before, else height
                        if(this.floors[i-1].getType() == TheSeaFloorType.GOING_UP)
                            this.addFloor(i, TheSeaFloorType.NORMAL, this.floors[i-1].getHeight()+1, this.floors[i-1]);
                        else
                            this.addFloor(i, TheSeaFloorType.NORMAL, this.floors[i-1].getHeight(), this.floors[i-1]);
                    break;
                    case TheSeaFloorType.GOING_DOWN: // Going down : height - 1
                        this.addFloor(i, TheSeaFloorType.GOING_DOWN, this.floors[i-1].getHeight()-1, this.floors[i-1]);
                    break;
                    case TheSeaFloorType.GOING_UP: // Going up : height if normal before, else height + 1
                        if(this.floors[i-1].getType() == TheSeaFloorType.NORMAL)
                            this.addFloor(i, TheSeaFloorType.GOING_UP, this.floors[i-1].getHeight(), this.floors[i-1]);
                        else
                            this.addFloor(i, TheSeaFloorType.GOING_UP, this.floors[i-1].getHeight()+1, this.floors[i-1]);
                    break;
                }
            }
        }
    }
    
    private generatePlants(x1: number, x2: number): void{
        // Set some parameters important for the generation
        var minPlantNumber: number = 0;
        var maxPlantNumber: number = 10;
        
        // Create some variables which will be useful
        var thereIsAlreadyAPlant: boolean;
        
        // Iterate over newly generated floors, searching for one which could receive a plant
        for(var i = x1; i <= x2; i++){
            if(Random.oneChanceOutOf(3) && // One chance out of 3
               i >= 4 && // We're not too much on the left
               this.floors[i].getType() == TheSeaFloorType.NORMAL && // This floor has the normal type
               this.floors[i].getHowManyFloorsOfTheSameTypeBefore() >= 4 // And there's at least 4 floors of the same type before
            ){
                // Init the variable
                thereIsAlreadyAPlant = false;
                
                // Check if there is already a plant
                for(var j = i-4; j <= i; j++){
                    // If this floor already has a plant on it
                    if(this.floors[j].getHasAPlant() == true){
                        thereIsAlreadyAPlant = true;
                        break;
                    }
                }
                
                // We add a plant here if there isn't already a plant on one of the floors
                if(thereIsAlreadyAPlant == false){
                    // We add the plant
                    this.addEntity(new Plant(this, new Pos(i-4, this.getRealQuestSize().y - this.floors[i].getHeight()), minPlantNumber, maxPlantNumber));
                    // We inform the floors that they now have a plant on them
                    for(var j = i-4; j <= i; j++){
                        this.floors[j].setHasAPlant(true);
                    }
                } 
            }
        }
    }
    
    private generateShellPowder(x1: number, x2: number): void{
        // If we don't already have shell powder and no shell powder have been generated in this quest so far and the distance is at least 500
        if(Saving.loadBool("gridItemPossessedShellPowder") == false && this.shellPowderGenerated == false && this.distance >= 500){
            // Iterate over newly generated floors, searching for one which could receive the powder
            for(var i = x1; i <= x2; i++){
                if(i >= 6 && // We're not too much on the left
                   this.floors[i].getType() == TheSeaFloorType.NORMAL && // This floor has the normal type
                   this.floors[i].getHowManyFloorsOfTheSameTypeBefore() >= 6 // And there's at least 6 floors of the same type before
                ){
                    // Check if there is already a plant, if so return
                    for(var j = i-6; j <= i; j++){
                        // If this floor already has a plant on it, return
                        if(this.floors[j].getHasAPlant() == true) return;
                    }
                    
                    // Add the powder and change the shellPowderGenerated bool
                    this.shellPowderGenerated = true;
                    this.addEntity(new ShellPowder(this, new Pos(i-6, this.getRealQuestSize().y - this.floors[i].getHeight())));
                    this.getLastEntity().setHealthBar(new QuestEntityHealthBar(this.getLastEntity(), new Pos(6, 1)));
                    
                    // Inform the floors that they now have a plant on them
                    for(var j = i-6; j <= i; j++){
                        this.floors[j].setHasAPlant(true);
                    }
                }
            }
        }
    }
    
    private generateSponge(x1: number, x2: number): void{
        // If we don't already have a sponge and no sponge have been generated in this quest so far and the distance is at least 793
        if(Saving.loadBool("gridItemPossessedSponge") == false && this.spongeGenerated == false && this.distance >= 793){ // 793 because Robert Edmond Grant, a sponge expert, was born in 1793 (source : wikipedia)
            // Iterate over newly generated floors, searching for one which could receive a sponge
            for(var i = x1; i <= x2; i++){
                if(i >= 6 && // We're not too much on the left
                   this.floors[i].getType() == TheSeaFloorType.NORMAL && // This floor has the normal type
                   this.floors[i].getHowManyFloorsOfTheSameTypeBefore() >= 6 // And there's at least 6 floors of the same type before
                ){
                    // Check if there is already a plant, if so return
                    for(var j = i-6; j <= i; j++){
                        // If this floor already has a plant on it, return
                        if(this.floors[j].getHasAPlant() == true) return;
                    }
                    
                    // Add the sponge and change the spongeGenerated bool
                    this.spongeGenerated = true;
                    this.addEntity(new Sponge(this, new Pos(i-6, this.getRealQuestSize().y - this.floors[i].getHeight())));
                    this.getLastEntity().setHealthBar(new QuestEntityHealthBar(this.getLastEntity(), new Pos(6, 1)));
                    
                    // Inform the floors that they now have a plant on them (well, actually its a sponge, but these "animals" looks kind of like plants, so don't worry about that)
                    for(var j = i-6; j <= i; j++){
                        this.floors[j].setHasAPlant(true);
                    }
                }
            }
        }
    }
    
    private globalScrolling(): void{
        // How much do we have to scroll ?
        var scrollingXOffset: number = -(this.getGame().getPlayer().getCharacterType() == PlayerCharacterType.MEDIUM? this.getGame().getPlayer().getGlobalPosition().x : this.getGame().getPlayer().getGlobalPosition().x - 2);
        
        // If we should scroll
        if(scrollingXOffset < 0){
            // Set the x last player movement
            this.lastPlayerMovement.x = -scrollingXOffset;
            
            // Increase the distance
            this.distance += -scrollingXOffset;
            
            // Scroll entities
            this.forceMovingAllEntities(new Pos(scrollingXOffset, 0));
            
            // Scroll the floor
            this.scrollFloor(-scrollingXOffset);
            
            // Generate new things to fill the new area
            this.generate(100 + scrollingXOffset + this.generationProjection, 99 + this.generationProjection);
        }
        else{
            // Set the x last player movement
            this.lastPlayerMovement.x = 0;
        }
    }
    
    private handlePatterns(x1: number, x2: number): void{
        // If the pattern is null or done, we need a new pattern
        if(this.currentPattern == null || this.currentPattern.isPatternDone()){
            // If the level is null, we begin with level 0
            if(this.currentPatternLevel == null)
                this.currentPatternLevel = new TheSeaPatternLevel_Level0(this);
            // Else, if the level is done, we get the next level from it
            else if(this.currentPatternLevel.isLevelDone())
                this.currentPatternLevel = this.currentPatternLevel.getNextLevel();
            
            // We get the new pattern from the current level
            this.currentPattern = this.currentPatternLevel.getPattern(this.distance);
        }
        
        // We run the pattern
        this.currentPattern.run(x1, x2);
    }
    
    private moveVertically(): void{
        var upPressed: boolean = Keyboard.isKeyPressed("up");
        var downPressed: boolean = Keyboard.isKeyPressed("down");
        
        if(upPressed && !downPressed){
            this.getGame().getPlayer().move(new Pos(0, -1));
            this.lastPlayerMovement.y = -1;
        }
        else if(downPressed && !upPressed){
            this.getGame().getPlayer().move(new Pos(0, 1));
            this.lastPlayerMovement.y = 1;
        }
    }
    
    private scrollFloor(howMany: number): void{
        for(var i = howMany; i <= 99 + this.generationProjection; i++){
            this.floors[i-howMany] = this.floors[i];
        }
    }
}
