///<reference path="CastleRoom.ts"/>

Saving.registerBool("dragonDone", false); // If true, it means we began talking to the dragon
Saving.registerBool("dragonUnlockedCyclops", false); // If true, we can ask the cyclops about the dragon

class Dragon extends CastleRoom{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // The dragon step
    private step: DragonStep;
    
    // The player position
    private playerPos: number;
    
    // The player attacking countdown (useful on DragonStep.PLAYER_ATTACKING to make the attack last a little bit)
    private playerAttackingCountdown: number;
    
    // The interval
    private timerIntervalID: number;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Set the default step and player position
        if(Saving.loadBool("dragonDone") == false){ // If we never talked with the dragon yet
            this.step = DragonStep.PLAYER_MOVING;
            this.playerPos = 0;
        }
        else{ // Else, we already talked with the dragon
            this.step = DragonStep.TALKING;
            this.playerPos = 60;
        }
        
        // Launch the interval and get the ID
        this.timerIntervalID = setInterval(this.actionInterval.bind(this), 100);
        
        // Resize and update
        this.renderArea.resizeFromArray(Database.getAscii("places/dragonFoot"), 0, 3);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // willStopBeingDisplayed()
    public willStopBeingDisplayed(): void{
        clearInterval(this.timerIntervalID);
    }
    
    // Private methods
    private actionInterval(): void{
        // Do something different depending on the step
        switch(this.step){
            case DragonStep.PLAYER_MOVING:
                // Move the player
                this.playerPos += 1;
                if(this.playerPos >= 60){ // If we made it to the dragon
                    // We're now attacking
                    this.step = DragonStep.PLAYER_ATTACKING;
                    // Set the countdown
                    this.playerAttackingCountdown = 40;
                }
                // Update
                this.update();
                this.getGame().updatePlace();
            break;
            case DragonStep.PLAYER_ATTACKING:
                // Lower the countdown
                this.playerAttackingCountdown -= 1;
                if(this.playerAttackingCountdown < 0){ // If it's time to stop attacking
                    // We're now "stop tickling"
                    this.step = DragonStep.STOP_TICKLING;
                }
                // Update
                this.update();
                this.getGame().updatePlace();
            break;
        }
    }
    
    private chooseCandies(): void{
        // Change the step
        this.step = DragonStep.TALKING_CANDIES;
        // Set the bool
        Saving.saveBool("dragonUnlockedCyclops", true);
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private chooseChallenge(): void{
        // Change the step
        this.step = DragonStep.TALKING_CHALLENGE;
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private chooseFame(): void{
        // Change the step
        this.step = DragonStep.TALKING_FAME;
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private drawPlayer(x: number, y: number = 26): void{
        this.renderArea.drawString("\\o/", x, y);
    }
    
    private goToDeveloper(): void{
        this.getGame().setPlace(new Developer(this.getGame()));
    }
    
    private goToHell(): void{
        this.getGame().setPlace(new Hell(this.getGame()));
    }
    
    private okayStopTickling(): void{
        if(this.step == DragonStep.STOP_TICKLING){
            // Change the step
            this.step = DragonStep.TALKING;
            // Set the bool
            Saving.saveBool("dragonDone", true);
            // Update
            this.update();
            this.getGame().updatePlace();
        }
    }
    
    private update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToTheCastleButton(this.renderArea, "dragonBackToTheCastleButton");
        
        // Draw the ascii
        this.renderArea.drawArray(Database.getAscii("places/dragonFoot"), 0, 3);
        
        // Draw something different depending on the step
        switch(this.step){
            case DragonStep.PLAYER_MOVING:
                // Draw the player (eventually going down the stairs at the beginning)
                this.drawPlayer(this.playerPos, 20 + (this.playerPos < 21? (Math.floor(this.playerPos/3)) : 6));
            break;
            case DragonStep.PLAYER_ATTACKING:
                // Draw the player
                this.drawPlayer(this.playerPos);
                // Draw the dragon fake health bar
                this.renderArea.drawString("|             A dragon foot : so much hp/so much hp             |", 45, 11);
                this.renderArea.addBackgroundColor(46, 109, 11, new Color(ColorType.HEALTH_GREEN));
            break;
            case DragonStep.STOP_TICKLING:
                // Draw the player
                this.drawPlayer(this.playerPos);
                // Draw the speech
                this.renderArea.drawSpeech(Database.getText("dragonStopTickling"), 5, 50, 78, "dragonStopTicklingSpeech", Database.getTranslatedText("dragonStopTickling"));
                // Add the button
                this.renderArea.addAsciiRealButton(Database.getText("dragonStopTicklingButton"), 50, 9, "dragonStopTicklingButton", Database.getTranslatedText("dragonStopTicklingButton"), true);
                this.renderArea.addLinkCall(".dragonStopTicklingButton", new CallbackCollection(this.okayStopTickling.bind(this)));
            break;
            case DragonStep.TALKING:
                // Draw the player
                this.drawPlayer(this.playerPos);
                // Draw the speech
                this.renderArea.drawSpeech(Database.getText("dragonTalking"), 5, 50, 78, "dragonTalkingSpeech", Database.getTranslatedText("dragonTalking"));
                // Add the challenge button
                this.renderArea.addAsciiRealButton(Database.getText("dragonTalkingChallengeButton"), 82, 5, "dragonTalkingChallengeButton", Database.getTranslatedText("dragonTalkingChallengeButton"));
                this.renderArea.addLinkCall(".dragonTalkingChallengeButton", new CallbackCollection(this.chooseChallenge.bind(this)));
                // Add the fame button
                this.renderArea.addAsciiRealButton(Database.getText("dragonTalkingFameButton"), 82, 7, "dragonTalkingFameButton", Database.getTranslatedText("dragonTalkingFameButton"));
                this.renderArea.addLinkCall(".dragonTalkingFameButton", new CallbackCollection(this.chooseFame.bind(this)));
                // Add the candies button
                this.renderArea.addAsciiRealButton(Database.getText("dragonTalkingCandiesButton"), 82, 9, "dragonTalkingCandiesButton", Database.getTranslatedText("dragonTalkingCandiesButton"));
                this.renderArea.addLinkCall(".dragonTalkingCandiesButton", new CallbackCollection(this.chooseCandies.bind(this)));
            break;
            case DragonStep.TALKING_CHALLENGE:
                // Draw the player
                this.drawPlayer(this.playerPos);
                // Draw the speech
                this.renderArea.drawSpeech(Database.getText("dragonTalkingChallengeSpeech"), 5, 50, 78, "dragonTalkingChallengeSpeech", Database.getTranslatedText("dragonTalkingChallengeSpeech"));
                // Add the button
                this.renderArea.addAsciiRealButton(Database.getText("dragonTalkingChallengeAnswer"), 82, 5, "dragonTalkingChallengeAnswer", Database.getTranslatedText("dragonTalkingChallengeAnswer"));
                this.renderArea.addLinkCall(".dragonTalkingChallengeAnswer", new CallbackCollection(this.goToHell.bind(this)));
            break;
            case DragonStep.TALKING_FAME:
                // Draw the player
                this.drawPlayer(this.playerPos);
                // Draw the speech
                this.renderArea.drawSpeech(Database.getText("dragonTalkingFameSpeech"), 5, 50, 78, "dragonTalkingFameSpeech", Database.getTranslatedText("dragonTalkingFameSpeech"));
                // Add the button
                this.renderArea.addAsciiRealButton(Database.getText("dragonTalkingFameAnswer"), 82, 7, "dragonTalkingFameAnswer", Database.getTranslatedText("dragonTalkingFameAnswer"));
                this.renderArea.addLinkCall(".dragonTalkingFameAnswer", new CallbackCollection(this.goToDeveloper.bind(this)));
            break;
            case DragonStep.TALKING_CANDIES:
                // Draw the player
                this.drawPlayer(this.playerPos);
                // Draw the speech
                this.renderArea.drawSpeech(Database.getText("dragonTalkingCandiesSpeech"), 5, 50, 78, "dragonTalkingCandiesSpeech", Database.getTranslatedText("dragonTalkingCandiesSpeech"));
                // Add the button
                this.renderArea.addAsciiRealButton(Database.getText("dragonTalkingCandiesAnswer"), 82, 9, "dragonTalkingCandiesAnswer", Database.getTranslatedText("dragonTalkingCandiesAnswer"));
                this.renderArea.addLinkCall(".dragonTalkingCandiesAnswer", new CallbackCollection(this.getGame().goToCastle.bind(this.getGame())));
            break;
        }
    }
}