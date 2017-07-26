///<reference path="ThirdHouseGame.ts"/>

Saving.registerNumber("galacticWarsBestScore", 0);

class GalacticWars extends ThirdHouseGame{
    // The global step of the game (splash screen, the menu, or the game itself
    private step: GalacticWarsStep = GalacticWarsStep.SPLASH_SCREEN;

    // The timer used for the splash screen
    private splashScreenTimer: number = 47;
    
    // The score of the player (it's also the reward in candies he/she will get at the end of the game)
    private score: number;

    // The ship y potisiton
    private shipYPosition: number;
    
    // Health points of the ship
    private hp: number;
    
    // The ship special power
    private power: number;
    private maxPower: number;
    
    // Asteroids
    private asteroids: Pos[] = [];
                                    
    // Should we exit the game?
    private exitGame: boolean = false;

    // Public methods
    public run(): boolean{
        // To store the return value
        var returnValue: boolean = false;
        
        // If we should exit the game, we return true
        if(this.exitGame)
            return true;
        
        // Reset the area
        this.getRenderArea().resetAllButSize();
        
        // Do something different depending on the step
        switch(this.step){
            case GalacticWarsStep.SPLASH_SCREEN:
                this.drawSplashScreen();
                returnValue = this.runSplashScreen();
            break;
            case GalacticWarsStep.GAME:
                this.drawGame();
                returnValue = this.runGame();
            break;
            case GalacticWarsStep.LOSE:
                this.drawLose();
                returnValue = false;
            break;
        }
        
        // We return
        return returnValue;
    }
    
    // Private methods
    private addAsteroids(): void{
        // Get the space sector we're in (0 to 3)
        var spaceSector: number = Math.floor(this.score/100) % 4;
        
        // Get the space difficulty (0 to x)
        var spaceDifficulty: number = Math.floor(Math.floor(this.score/100) / 4);
        
        // Get the spaceSeed43 (0 to 43), the spaceSeed21 (0 to 21) and the spaceSeed10 (0 to 10)
        var spaceSeed43: number = this.score % 44;
        var spaceSeed21: number = Math.floor(spaceSeed43/2);
        var spaceSeed10: number = Math.floor(spaceSeed21/2);
        
        // Add different asteroids depending on the sector, the difficulty, and the seed
        switch(spaceSector){
            // First sector : the seed is riding our tunnels, officer!
            case 0:
                switch(spaceDifficulty){
                    case 0:
                        if(spaceSeed43 < 11 && spaceSeed21 < 6)
                            this.addAsteroid(spaceSeed10);
                        else if(spaceSeed43 > 29 && spaceSeed21 > 14)
                            this.addAsteroid(spaceSeed10);
                    break;
                    case 1:
                        if(spaceSeed43 < 13 && spaceSeed21 < 7)
                            this.addAsteroid(spaceSeed10);
                        else if(spaceSeed43 > 27 && spaceSeed21 > 13)
                            this.addAsteroid(spaceSeed10);
                    break;
                    default:
                        if(spaceSeed43 < 15 && spaceSeed21 < 8)
                            this.addAsteroid(spaceSeed10);
                        else if(spaceSeed43 > 25 && spaceSeed21 > 12)
                            this.addAsteroid(spaceSeed10);
                    break;
                }
            break;
            // Second sector
            case 1:
                switch(spaceDifficulty){
                    case 0:
                        if(spaceSeed43 % 3 == 0 && (this.score*7) % 25 > 15){
                            for(var i = spaceSeed10 - 1; i <= spaceSeed10 + 1; i++){
                                if(i >= 0 && i <= 10)
                                    this.addAsteroid(i);
                            }
                        }
                    break;
                    case 1:
                        if(spaceSeed43 % 3 == 0 && (this.score*7) % 25 > 12){
                            for(var i = spaceSeed10 - 1; i <= spaceSeed10 + 1; i++){
                                if(i >= 0 && i <= 10)
                                    this.addAsteroid(i);
                            }
                        }
                    break;
                    default:
                        if(spaceSeed43 % 3 == 0 && (this.score*7) % 25 > 10){
                            for(var i = spaceSeed10 - 1; i <= spaceSeed10 + 1; i++){
                                if(i >= 0 && i <= 10)
                                    this.addAsteroid(i);
                            }
                        }
                    break;
                }
            break;
            // Third sector
            case 2:
                switch(spaceDifficulty){
                    case 0:
                        if(this.score % 25 == 0){
                            var holePos: number = Random.between(0, 9);
                            for(var i = 0; i <= 10; i++){
                                if(i != holePos && i != holePos + 1){
                                    this.addAsteroid(i);
                                }
                            }
                        }
                    break;
                    case 1:
                        if(this.score % 20 == 0){
                            var holePos: number = Random.between(0, 9);
                            for(var i = 0; i <= 10; i++){
                                if(i != holePos && i != holePos + 1){
                                    this.addAsteroid(i);
                                }
                            }
                        }
                    break;
                    default:
                        if(this.score % 15 == 0){
                            var holePos: number = Random.between(0, 9);
                            for(var i = 0; i <= 10; i++){
                                if(i != holePos && i != holePos + 1){
                                    this.addAsteroid(i);
                                }
                            }
                        }
                    break;
                }
            break;
            // Fourth sector : a bit of randomness
            case 3:
                switch(spaceDifficulty){
                    case 0:
                        if(Random.oneChanceOutOf(15)) this.addAsteroid(Random.between(0, 10));
                    break;
                    case 1:
                        if(Random.oneChanceOutOf(10)) this.addAsteroid(Random.between(0, 10));
                    break;
                    case 2:
                        if(Random.oneChanceOutOf(7)) this.addAsteroid(Random.between(0, 10));
                    break;
                    default:
                        if(Random.oneChanceOutOf(5)) this.addAsteroid(Random.between(0, 10));
                    break;
                }
            break;
        }
    }
    
    private addAsteroid(y: number): void{
        this.asteroids.push(new Pos(53, y));
    }
    
    private checkCollision(): boolean{
        // If the ship is outside the screen, we return true
        if(this.shipYPosition < 0)
            return true;
        if(this.shipYPosition > 9)
            return true;
        
        // No collision, we return false
        return false;
    }
    
    private checkCollisionWithAsteroids(): boolean{
        // Boolean used to know if we already lose one hp or not
        var loseOneHp: boolean = false;
        
        for(var i = 0; i < this.asteroids.length; i++){
            // There's a collision
            if(this.shipCollidesWithThisPos(this.asteroids[i])){
                if(loseOneHp == false){
                    // We lose one hp
                    this.hp -= 1;
                    loseOneHp = true;
                }
                // We destroy the asteroid
                this.asteroids.splice(i, 1);
                i--;
            }
        }
        
        // If we have less than 1 hp, we return true
        if(this.hp < 1)
            return true;
        
        // Else, we return false
        return false;
    }
    
    private drawGame(): void{
        // Draw the score
        this.getRenderArea().drawString("Score : " + this.score.toString(), 0, 0);
        
        // Draw hp
        this.getRenderArea().drawString("| HP : " + this.hp.toString(), 43, 0);
        
        // Draw the power
        this.getRenderArea().drawString("| Power : [", 14, 0);
        this.getRenderArea().drawHorizontalLine("x", 25, 25 + Math.floor(this.power / 150 * 16), 0);
        this.getRenderArea().drawString("]", 41, 0);
        
        // Draw the ship
        this.getRenderArea().drawArray(Database.getAscii("places/village/thirdHouseGames/GalacticWars/ship"), 0, 1 + this.shipYPosition);
        
        // Draw asteroids
        for(var i = 0; i < this.asteroids.length; i++){
            this.getRenderArea().drawString("O", this.asteroids[i].x, 1 + this.asteroids[i].y);
        }
    }
    
    private drawLose(): void{
        // Draw "you lose"
        this.getRenderArea().drawArray(Database.getAscii("places/village/thirdHouseGames/GalacticWars/youLose"), 8, 1);
        
        // Draw the candies we won
        this.getRenderArea().drawString("Score : " + this.score + ".", 8, 7);
        this.getRenderArea().drawString("You gain " + (this.score + Algo.correctIfUnderZero(this.score-1000)*30) + " candies.", 8, 8);
        
        this.getRenderArea().drawString("Best score : " + Saving.loadNumber("galacticWarsBestScore") + ".", 8, 10);
    }
    
    private drawSplashScreen(): void{
        this.getRenderArea().drawArray(Database.getAscii("places/village/thirdHouseGames/GalacticWars/splashScreen"), -87 + this.splashScreenTimer*3, 2);
    }
    
    private goToLose(): void{
        // Change the step
        this.step = GalacticWarsStep.LOSE;
        
        // Get the candies
        this.getThirdHouse().getGame().getCandies().add(this.score + Algo.correctIfUnderZero(this.score-1000)*30);
        
        // Update the best score
        if(this.score > Saving.loadNumber("galacticWarsBestScore")) Saving.saveNumber("galacticWarsBestScore", this.score);
    }
    
    private goToGame(): void{
        // Change the step
        this.step = GalacticWarsStep.GAME;
        
        // Set some useful parameters
        this.score = 2;
        this.shipYPosition = 4;
        this.hp = 10;
        this.power = 150;
        this.maxPower = 150;
        
        // Set the quest speedup
        this.getThirdHouse().getGame().setQuestSpeedUp(-50);
    }
    
    public pressedDownButton(): void{

    }
    
    public pressedSpaceButton(): void{
        // Variable used when deleting asteroids
        var oldI: number;
        
        // If we pressed space and we were losing, we should now exit the game
        if(this.step == GalacticWarsStep.LOSE)
            this.exitGame = true;
        // Else, if we're playing
        else if(this.step == GalacticWarsStep.GAME){
            // If we have enough power
            if(this.power == this.maxPower){
                // We delete 3/4 of the asteroids
                oldI = 0;
                for(var i = 0; i < this.asteroids.length; i++){
                    if((oldI % 5) != 0){
                        this.asteroids.splice(i, 1);
                        i--;
                    }
                    oldI++;
                }
                // We have no more power
                this.power = 0;
            }
        }
    }
    
    public pressedUpButton(): void{

    }
    
    private runGame(): boolean{
        // Variable used to calc the quest speedup later
        var questSpeedUp: number = 0;
        
        // Handle the keys
        if(Keyboard.isKeyPressed("down")){
            // We try to make the ship go down
            this.shipYPosition += 1;
                
            // If there's a collision, we revert
            if(this.checkCollision())
                this.shipYPosition -= 1;
        }
        else if(Keyboard.isKeyPressed("up")){
            // We try to make the ship go up
            this.shipYPosition -= 1;
        
            // If there's a collision, we revert
            if(this.checkCollision())
                this.shipYPosition += 1;
        }
        
        // Shift asteroids on the left
        for(var i = 0; i < this.asteroids.length; i++){
            // If we can shift it, we do so
            if(this.asteroids[i].x > 0)
                this.asteroids[i].x -= 1;
            // Else, we delete it
            else{
                this.asteroids.splice(i, 1);
                i--;
            }
        }
        
        // Add asteroids
        this.addAsteroids();
        
        // Increase the score
        this.score = Math.ceil(Math.pow(this.score, 1.00015));
        
        // Increase the power
        if(this.power < this.maxPower)
            this.power += 1;
        
        // Check the collision of the player with asteroids
        if(this.checkCollisionWithAsteroids())
            this.goToLose();
        
        return false;
    }
    
    private runSplashScreen(): boolean{
        // If the timer is >= 0
        if(this.splashScreenTimer >= 0){
            // Reduce the timer
            this.splashScreenTimer -= 1;
        }
        // Else
        else{
            // Switch to the next step
            this.goToGame();
        }
        
        // We can't end the game during the splash screen
        return false;
    }
    
    private shipCollidesWithThisPos(pos: Pos): boolean{
        if(pos.x < 0)
            return false;
        
        if(pos.x > 10)
            return false;
        
        if(pos.y < this.shipYPosition)
            return false;
        
        if(pos.y > this.shipYPosition + 1)
            return false;
        
        return true;
    }
}