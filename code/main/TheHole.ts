///<reference path="Quest.ts"/>

// To know if the player found the chests
Saving.registerBool("theHoleFirstChestFound", false);
Saving.registerBool("theHoleSecondChestFound", false);
Saving.registerBool("theHoleThirdChestFound", false);
Saving.registerBool("theHoleFourthChestFound", false);

class TheHole extends Quest{
    // Variables which store the open states of the chests for the current quest
    private firstChestOpened: boolean = false;
    private secondChestOpened: boolean = false;
    private thirdChestOpened: boolean = false;
    private fourthChestOpened: boolean = false;
    
    // A bool to know if the player is going left or right (useful to choose the fireball spell direction)
    // By default we're going right because in most quests the fireball is launched to the right, so it just seems more logical
    // But anyway as soon as the player will press the left key this can change
    private isGoingRight: boolean = true;
    
    // Constructor
    constructor(game: Game){
        super(game, "You can move with the left and right arrow keys!");
        
        // Resize the quest
        this.resizeQuest(100, 35, new Pos(100, 136));
        
        // Add collision boxes around
        this.addPlayerCollisionBoxes(true, true, true, true);
        
        // Add the player
        this.getGame().getPlayer().loadCandyBoxCharacter(this);
        this.getGame().getPlayer().setGlobalPosition(new Pos(48, 0));
        this.configPlayerOrClone(this.getGame().getPlayer());
        this.addEntity(this.getGame().getPlayer());
        
        // Add the walls
        this.createWalls();
        
        // Add the spikes
        this.addSpikes(new Spikes(this, new Pos(44, 42), 20));
        this.addSpikes(new Spikes(this, new Pos(23, 59), 22));
        this.addSpikes(new Spikes(this, new Pos(90, 62), 8));
        this.addSpikes(new Spikes(this, new Pos(87, 69), 4));
        this.addSpikes(new Spikes(this, new Pos(94, 69), 4));
        this.addSpikes(new Spikes(this, new Pos(93, 74), 2));
        this.addSpikes(new Spikes(this, new Pos(66, 74), 14));
        this.addSpikes(new Spikes(this, new Pos(66, 82), 4));
        this.addSpikes(new Spikes(this, new Pos(76, 83), 6));
        this.addSpikes(new Spikes(this, new Pos(3, 95), 8));
        this.addSpikes(new Spikes(this, new Pos(13, 97), 10));
        this.addSpikes(new Spikes(this, new Pos(24, 96), 2));
        this.addSpikes(new Spikes(this, new Pos(29, 96), 2));
        this.addSpikes(new Spikes(this, new Pos(33, 95), 12));
        this.addSpikes(new Spikes(this, new Pos(64, 64), 4));
        
        // Add the chests
        this.addChest(new Chest(this, new Pos(27, 67), true, new CallbackCollection(this.openFirstChest.bind(this)), Saving.loadBool("theHoleFirstChestFound")));
        this.addChest(new Chest(this, new Pos(59, 74), true, new CallbackCollection(this.openSecondChest.bind(this)), Saving.loadBool("theHoleSecondChestFound")));
        this.addChest(new Chest(this, new Pos(37, 107), false, new CallbackCollection(this.openThirdChest.bind(this)), Saving.loadBool("theHoleThirdChestFound")));
        this.addChest(new Chest(this, new Pos(4, 129), true, new CallbackCollection(this.openFourthChest.bind(this)), Saving.loadBool("theHoleFourthChestFound")));
        
        // Add the lost tribe warrior alone in its room
        this.addLostTribeWarrior(new LostTribeWarrior(this, new Pos(68, 89), new Pos(63, 85), new Pos(93, 95)));
        
        // Add the lost tribe warriors in the big room
        this.addLostTribeWarrior(new LostTribeWarrior(this, new Pos(14, 126), new Pos(2, 112), new Pos(79, 129)));
        this.addLostTribeWarrior(new LostTribeWarrior(this, new Pos(21, 126), new Pos(2, 112), new Pos(79, 129)));
        this.addLostTribeWarrior(new LostTribeWarrior(this, new Pos(31, 125), new Pos(2, 112), new Pos(79, 129)));
        this.addLostTribeWarrior(new LostTribeWarrior(this, new Pos(51, 123), new Pos(2, 112), new Pos(79, 129)));
        
        // Add the message
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You jumped into the big hole! You're falling quickly, try to stay alive!"));
    }
    
    // willBeDisplayed()
    public willBeDisplayed(): void{
        // We call the mother willBeDisplayed()
        super.willBeDisplayed();
        
        // Register hotkeys so that they can't be used by the player's browser
        this.getGame().addHotkey(new Hotkey("left", null));
        this.getGame().addHotkey(new Hotkey("right", null));
    }
    
    // Public methods
    public castPlayerFireball(): void{
        // If we're going right, we cast a fireball going right ; if we're going left, we cast a fireball going left
        if(this.isGoingRight)
            super.castPlayerFireball(new Pos(2, 0));
        else
            super.castPlayerFireball(new Pos(-2, 0));
    }
    
    public castPlayerTeleport(): void{
        super.castPlayerTeleport(new Pos(48, 0), new Pos(1, 1));
    }
    
    public configPlayerOrClone(entity: QuestEntity): void{
        entity.setQuestEntityMovement(new QuestEntityMovement());
        entity.getQuestEntityMovement().setGravity(true);
        entity.getQuestEntityMovement().setWormsLike(true);
    }
    
    public endQuest(win: boolean): void{
        if(win){
            // We add the message
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You managed to reach the bottom of the hole!"));
        }
        else{
            // We add the message
            this.getGame().getQuestLog().addMessage(new QuestLogMessage("You died while falling in the hole. No one will probably ever find your body down there."));
        }
        
        // We call the endQuest method of our mother class
        super.endQuest(win);
        
        // If we won, we possibly confirm the opening of some of the chests, depending on our variables
        if(win){
            if(this.firstChestOpened) Saving.saveBool("theHoleFirstChestFound", true);
            if(this.secondChestOpened) Saving.saveBool("theHoleSecondChestFound", true);
            if(this.thirdChestOpened) Saving.saveBool("theHoleThirdChestFound", true);
            if(this.fourthChestOpened) Saving.saveBool("theHoleFourthChestFound", true);
        }
    }
    
    public update(): void{
        if(this.getQuestEnded() == false){
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
            
            // Move the player horizontally
            this.moveHorizontally();
            
            // Update entities
            this.updateEntities();
            
            // Calculate the new global drawing offset
            this.calcNewGlobalDrawingOffset();
        }
        
        // Draw
        this.preDraw();
        this.getRenderArea().drawArray(Database.getPartOfAscii("places/quests/theHole/background", -this.getGlobalDrawingOffset().y, -this.getGlobalDrawingOffset().y + 35), this.getRealQuestPosition().x, this.getRealQuestPosition().y);
        this.drawEntities();
        this.drawAroundQuest();
        if(this.getQuestEnded() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeeping");
        else if(this.getQuestEndedAndWeWon() == false) this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestNoKeepingBecauseLose");
        else this.addExitQuestButton(new CallbackCollection(this.getGame().goToMainMap.bind(this.getGame())), "buttonExitQuestKeeping");
        this.postDraw();
    }
    
    // Private methods
    private addChest(chest: Chest): void{
        this.addEntity(chest);
    }
    
    private addLostTribeWarrior(lostTribeWarrior: LostTribeWarrior): void{
        lostTribeWarrior.setHealthBar(new QuestEntityHealthBar(lostTribeWarrior, new Pos(4, 1)));
        this.addEntity(lostTribeWarrior);
    }
    
    private addSpikes(spikes: Spikes): void{
        this.addEntity(spikes);
    }
    
    private addWalls(...positions: number[]): void{
        // Create the wall entity
        this.addEntity(new Wall(this, new Pos(0, 0)));
        var wall: Wall = <Wall>(this.getLastEntity());
        
        // Add the boxes
        for(var i = 0; i < positions.length/4; i++){
            wall.addBox(new Pos(positions[i*4], positions[i*4+1]), new Pos(positions[i*4+2] - positions[i*4] + 1, positions[i*4+3] - positions[i*4+1] + 1));
        }
    }
    
    private calcNewGlobalDrawingOffset(): void{
        // If the player is too low or too high on the screen (that's why we take the offset in account here), we set the offset to follow the player
        if(this.getGame().getPlayer().getGlobalPosition().y + this.getGlobalDrawingOffset().y > 10)
            this.setGlobalDrawingOffset(new Pos(0, -this.getGame().getPlayer().getGlobalPosition().y + 10));
        else if(this.getGame().getPlayer().getGlobalPosition().y + this.getGlobalDrawingOffset().y < 5){
            if(this.getGame().getPlayer().getGlobalPosition().y > 5)
                this.setGlobalDrawingOffset(new Pos(0, -this.getGame().getPlayer().getGlobalPosition().y + 5));
            else this.setGlobalDrawingOffset(new Pos(0, 0));
        }
    }
    
    private createWalls(): void{
        // Yes, I know that the code below is quite ugly
        // But I had two choices : either write the bounding boxes manually (this is what I chose)
        // Or write a specific level editor to do the work for me (it could work with something like the height maps in 3d games - there would be a second "ascii art" composed of 0 and 1 for example, 0 would mean no collision and 1 would mean collision)
        // But this is the only level which requires such complicated bounding boxes, so really, writing a level editor for one level isn't worth it
        this.addWalls(0, 0, 40, 22,
                      0, 23, 39, 23,
                      0, 24, 38, 24,
                      0, 25, 37, 25,
                      0, 26, 36, 26,
                      0, 27, 33, 27,
                      0, 28, 32, 28,
                      0, 29, 31, 29,
                      0, 30, 30, 30,
                      0, 31, 29, 31,
                      0, 32, 28, 32,
                      0, 33, 27, 33,
                      0, 34, 26, 34,
                      0, 35, 25, 35,
                      0, 36, 24, 36,
                      0, 37, 23, 37,
                      0, 38, 22, 59,
                      0, 60, 44, 60,
                      0, 61, 43, 61,
                      0, 62, 27, 62,
                      34, 62, 38, 62,
                      0, 63, 26, 63,
                      0, 64, 25, 66,
                      0, 67, 26, 67,
                      0, 68, 33, 68,
                      0, 69, 32, 69,
                      0, 70, 31, 70,
                      0, 71, 27, 71,
                      0, 72, 26, 72,
                      0, 73, 25, 73,
                      0, 74, 24, 74,
                      0, 75, 16, 75,
                      0, 76, 15, 76,
                      0, 77, 4, 77,
                      0, 78, 3, 80,
                      0, 81, 2, 81,
                      0, 82, 1, 95,
                      36, 73, 39, 73,
                      35, 74, 40, 74,
                      34, 75, 41, 75,
                      33, 76, 49, 76,
                      32, 77, 49, 77,
                      32, 78, 49, 78,
                      33, 79, 49, 79,
                      34, 80, 49, 80,
                      35, 81, 49, 81,
                      36, 82, 49, 82,
                      37, 83, 49, 85,
                      37, 86, 49, 86,
                      38, 87, 50, 87,
                      39, 88, 51, 88,
                      45, 89, 52, 89,
                      46, 90, 54, 90,
                      47, 91, 54, 94,
                      46, 95, 54, 95,
                      0, 96, 11, 96,
                      32, 96, 54, 96,
                      0, 97, 12, 97,
                      23, 97, 26, 97,
                      28, 97, 54, 97,
                      0, 98, 26, 101,
                      28, 98, 54, 101,
                      0, 102, 26, 102,
                      28, 102, 57, 102,
                      0, 103, 23, 103,
                      35, 103, 65, 103,
                      0, 104, 20, 104,
                      36, 104, 69, 104,
                      0, 105, 19, 105,
                      41, 105, 74, 105,
                      0, 106, 18, 106,
                      41, 106, 87, 106,
                      0, 107, 17, 109,
                      40, 107, 87, 107,
                      29, 108, 87, 108,
                      28, 109, 87, 109,
                      0, 110, 18, 110,
                      27, 110, 68, 110,
                      0, 111, 57, 111,
                      0, 112, 39, 112,
                      0, 113, 30, 113,
                      0, 114, 8, 114,
                      0, 115, 7, 115,
                      0, 116, 6, 116,
                      0, 117, 5, 119,
                      0, 120, 4, 120,
                      0, 121, 3, 121,
                      0, 122, 2, 128,
                      0, 129, 3, 129,
                      79, 112, 87, 112,
                      78, 113, 87, 113,
                      77, 114, 87, 114,
                      76, 115, 87, 115,
                      75, 116, 87, 116,
                      74, 117, 87, 117,
                      73, 118, 87, 118,
                      71, 119, 87, 119,
                      70, 120, 87, 120,
                      69, 121, 87, 121,
                      68, 122, 87, 122,
                      66, 123, 87, 123,
                      64, 124, 87, 124,
                      61, 125, 87, 125,
                      56, 126, 87, 126,
                      50, 127, 86, 127,
                      41, 128, 85, 128,
                      27, 129, 84, 129,
                      0, 130, 79, 130,
                      0, 131, 72, 131,
                      0, 132, 71, 132,
                      0, 133, 70, 134,
                      0, 135, 100, 135,
                      59, 0, 100, 24,
                      60, 25, 100, 25,
                      61, 26, 100, 26,
                      62, 27, 100, 27,
                      63, 28, 100, 28,
                      64, 29, 100, 42,
                      44, 43, 100, 43,
                      45, 44, 100, 44,
                      46, 45, 100, 45,
                      50, 46, 100, 46,
                      57, 47, 100, 47,
                      69, 48, 100, 48,
                      70, 49, 100, 49,
                      75, 50, 100, 50,
                      84, 51, 100, 51,
                      85, 52, 100, 52,
                      92, 53, 100, 53,
                      93, 54, 100, 54,
                      83, 55, 89, 55,
                      94, 55, 100, 55,
                      82, 56, 88, 56,
                      94, 56, 100, 56,
                      81, 57, 87, 57,
                      94, 57, 100, 57,
                      77, 58, 86, 58,
                      95, 58, 100, 58,
                      76, 59, 86, 59,
                      96, 59, 100, 59,
                      75, 60, 86, 60,
                      97, 60, 100, 60,
                      71, 61, 86, 61,
                      98, 61, 100, 69,
                      90, 63, 98, 63,
                      70, 62, 86, 62,
                      69, 63, 86, 63,
                      59, 64, 63, 64,
                      68, 64, 86, 64,
                      58, 65, 86, 65,
                      53, 66, 86, 66,
                      52, 67, 86, 67,
                      51, 68, 86, 68,
                      46, 69, 86, 69,
                      45, 70, 90, 70,
                      94, 70, 100, 70,
                      45, 71, 60, 71,
                      82, 71, 89, 71,
                      95, 71, 100, 74,
                      51, 72, 58, 72,
                      52, 73, 57, 73,
                      53, 74, 58, 74,
                      54, 75, 100, 75,
                      55, 76, 100, 77,
                      55, 78, 62, 78,
                      75, 78, 100, 78,
                      55, 79, 59, 79,
                      87, 79, 100, 79,
                      88, 80, 100, 80,
                      89, 81, 100, 81,
                      90, 82, 100, 82,
                      53, 83, 75, 83,
                      91, 83, 100, 83,
                      54, 84, 87, 84,
                      92, 84, 100, 84,
                      55, 85, 87, 85,
                      93, 85, 100, 95,
                      59, 86, 86, 86,
                      60, 87, 78, 87,
                      60, 88, 66, 88,
                      59, 89, 64, 89,
                      58, 90, 63, 91,
                      58, 92, 64, 92,
                      58, 93, 73, 93,
                      58, 94, 78, 94,
                      58, 95, 83, 95,
                      58, 96, 100, 97,
                      59, 98, 100, 98,
                      60, 99, 100, 99,
                      71, 100, 100, 100,
                      82, 101, 100, 101,
                      92, 102, 100, 103,
                      91, 104, 100, 129,
                      90, 130, 100, 130,
                      89, 131, 100, 131,
                      88, 132, 100, 132,
                      85, 133, 100, 133,
                      78, 134, 100, 134
                    );
    }

    private openFirstChest(): void{
        this.firstChestOpened = true;
        this.foundGridOrEqItem(new QuestItemFound(this, "gridItemPossessedHeartPendant", "You opened a chest and found a heart pendant!", "You gain a heart pendant."));
    }
    
    private openFourthChest(): void{
        this.fourthChestOpened = true;
        this.foundChocolateBars(4);
        this.getGame().getQuestLog().addMessage(new QuestLogMessage("You opened a chest and found four chocolate bars!", null, true));
    }
    
    private openSecondChest(): void{
        this.secondChestOpened = true;
        this.foundGridOrEqItem(new QuestItemFound(this, "gridItemPossessedFortressKey", "You opened a chest and found the desert fortress key!", "You gain the desert fortress key."));
    }
    
    private openThirdChest(): void{
        this.thirdChestOpened = true;
        this.foundGridOrEqItem(new QuestItemFound(this, "gridItemPossessedBlackMagicGrimoire", "You opened a chest and found a grimoire!", "You gain a black magic grimoire."));
    }
    
    private moveHorizontally(): void{
        var leftPressed: boolean = Keyboard.isKeyPressed("left");
        var rightPressed: boolean = Keyboard.isKeyPressed("right");
        
        if(leftPressed && !rightPressed){
            this.getGame().getPlayer().move(new Pos(-1, 0));
            this.isGoingRight = false;
        }
        else if(rightPressed && !leftPressed){
            this.getGame().getPlayer().move(new Pos(1, 0));
            this.isGoingRight = true;
        }
    }
    
    private thePlayerWon(): boolean{
        // If the player reached the bottom of the hole
        if(this.getGame().getPlayer().getGlobalPosition().y >= 134)
            return true;
        
        return false;
    }
}
