///<reference path="TheSeaPattern.ts"/>

class TheSeaPattern_Boss1_Seahorses extends TheSeaPattern{
    // Variables
    private seahorses: Seahorse[] = [];
    private seahorsesAdded: boolean = false;
    private seaHorsesStopped: boolean = false;
    
    // The special seahorse wandering
    private seahorseWandering: Seahorse = null;
    private seahorseWanderingIsGoingUp: boolean = false;
    
    // The special seahorse following player
    private seahorseFollowingPlayer: Seahorse = null;
    
    // Constructor
    constructor(theSea: TheSea, initialDistance: number){
        super(theSea, initialDistance);
    }
    
    // Public methods
    public addSeahorse(seahorse: Seahorse): Seahorse{
        if(seahorse != null){
            this.seahorses.push(seahorse);
            return seahorse;
        }
        return null;
    }
    
    public isPatternDone(): boolean{
        // Return false if seahorses aren't added yet
        if(this.seahorsesAdded == false)
            return false;
        
        // Return false if any of the seahorses is still alive
        for(var i = 0; i < this.seahorses.length; i++){
            if(this.seahorses[i].getDead() == false)
                return false;
        }
        
        return true;
    }
    
    public run(x1: number, x2: number): void{
        // If we didn't add seahorses already (and we're far enough), we do so
        if(this.seahorsesAdded == false && this.getTheSea().getDistance() > this.getInitialDistance() + 30){
            this.seahorsesAdded = true;
            // First column
            this.addSeahorse(this.getTheSea().addSeahorse(new Pos(x1, 2), 75));
            this.addSeahorse(this.getTheSea().addSeahorse(new Pos(x1, 12), 75));
            // Second column
            this.seahorseWandering = this.addSeahorse(this.getTheSea().addSeahorse(new Pos(x1+7, 10), 81));
            // Third Column
            this.seahorseFollowingPlayer = this.addSeahorse(this.getTheSea().addSeahorse(new Pos(x1+14, 10), 87));
            // Fourth column
            this.addSeahorse(this.getTheSea().addSeahorse(new Pos(x1+21, 7), 93));
            this.addSeahorse(this.getTheSea().addSeahorse(new Pos(x1+21, 17), 93));
        }
        
        // If we already added seahorses, we increase the moving counter
        if(this.seahorsesAdded == true && this.seaHorsesStopped == false){
            // Find the seahorse which is the most on the left and store its x position
            var mostLeftX = 500;
            for(var i = 0; i < this.seahorses.length; i++){
                if(this.seahorses[i].getGlobalPosition().x < mostLeftX)
                    mostLeftX = this.seahorses[i].getGlobalPosition().x;
            }
            // If this mostLeftX is <= 75
            if(mostLeftX - this.getTheSea().getGame().getPlayer().getGlobalPosition().x <= 75){
                // We stop the seahorses
                this.seaHorsesStopped = true;
                for(var i = 0; i < this.seahorses.length; i++){
                    this.seahorses[i].getQuestEntityMovement().setOffset(new Pos(0, 0));
                }
            }
        }
        
        // If the sea horses are stopped, we adjust their movement so that they swim with the player
        if(this.seaHorsesStopped){
            for(var i = 0; i < this.seahorses.length; i++){
                this.seahorses[i].tryToGoToIntendedXPosition(this.getTheSea().getGame().getPlayer().getGlobalPosition().x);
            }
        }
        
        // We handle the special seahorse wandering
        if(this.seahorseWandering != null){
            if(this.seahorseWanderingIsGoingUp){
                this.seahorseWandering.getQuestEntityMovement().getOffset().y = -1;
                if(this.seahorseWandering.getGlobalPosition().y <= 0) this.seahorseWanderingIsGoingUp = false;
            }
            else{
                this.seahorseWandering.getQuestEntityMovement().getOffset().y = 1;
                if(this.seahorseWandering.getGlobalPosition().y >= 16) this.seahorseWanderingIsGoingUp = true;
            }
        }
        
        // We handle the special seahorse following the player
        if(this.seahorseFollowingPlayer != null){
            // By default we don't move
            this.seahorseFollowingPlayer.getQuestEntityMovement().getOffset().y = 0;
            // If the player is above
            if(this.getTheSea().getGame().getPlayer().getGlobalPosition().y < this.seahorseFollowingPlayer.getGlobalPosition().y - 1){
                // If we're not too high
                if(this.seahorseFollowingPlayer.getGlobalPosition().y > 0)
                    // We go up
                    this.seahorseFollowingPlayer.getQuestEntityMovement().getOffset().y = -1;
            }
            // Else, if the player is below
            else if(this.getTheSea().getGame().getPlayer().getGlobalPosition().y > this.seahorseFollowingPlayer.getGlobalPosition().y - 1){
                // If we're not too low
                if(this.seahorseFollowingPlayer.getGlobalPosition().y < 17)
                    // We go down
                    this.seahorseFollowingPlayer.getQuestEntityMovement().getOffset().y = +1;
            }
        }
    }
}
