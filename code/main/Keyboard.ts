module Keyboard{
    // The game
    var game: Game;
    
    export function setGame(gameGiven: Game): void{
        game = gameGiven;
    }
    
    export function execute(): void{
        // Handle keydown events
        $(document).keydown(function(event){
            // Can we use hotkeys ?
            var canUseHotkeys: boolean = getCanUseHotkeys();
            
            // Handle hotkeys
            for(var keyString in game.getHotkeys()){
                if(event.which == game.getHotkeys()[keyString].getKey()){
                    game.getHotkeys()[keyString].setPressed(true);
                    if(canUseHotkeys){
                        if(game.getHotkeys()[keyString].getCallbackCollection() != null) game.getHotkeys()[keyString].getCallbackCollection().fire();
                        event.preventDefault();
                        return false;
                    }
                }
            }
            
            // Handle special hotkeys
            if(canUseHotkeys){
                for(var i = 0; i < game.getSpecialHotkeys().length; i++){
                    if(event.which == game.getSpecialHotkeys()[i].getKey()){
                        if(game.getSpecialHotkeys()[i].getCallbackCollection() != null) game.getSpecialHotkeys()[i].getCallbackCollection().fire();
                        event.preventDefault();
                        return false;
                    }
                }
            }
        });
        
        // Handle keyup events
        $(document).keyup(function(event){
            // Handle hotkeys
            for(var keyString in game.getHotkeys()){
                if(event.which == game.getHotkeys()[keyString].getKey()){
                    game.getHotkeys()[keyString].setPressed(false);
                }
            }
        });
    }
    
    function getCanUseHotkeys(): boolean{
        if($(':focus').hasClass("noHotkeys"))
            return false;
        return true;
    }
    
    export function isKeyPressed(keyString: string): boolean{
        return game.getHotkeys()[keyString].getPressed();
    }
}
