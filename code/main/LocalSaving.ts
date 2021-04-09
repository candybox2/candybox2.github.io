module LocalSaving{
    // Public functions
    export function getSlotSummaryAsString(slotId: string): string{
        // If there's no save on this slot
        if(loadString(slotId) == null){
            return "empty";
        }
        // Else, there's a save on this slot
        else{
            return loadString(slotId) + ", candies : " + loadString(slotId + ".gameCandiesCurrent");
        }
    }
    
    export function load(slotId: string): boolean{
        // If this sot doesn't seem to exist, we return false
        if(loadString(slotId) == null)
            return false;
        
        // Load bools
        for(var str in Saving.getAllBools()){
            Saving.saveBool(str, this.loadBool(slotId + "." + str));
        }
        
        // Load numbers
        for(var str in Saving.getAllNumbers()){
            Saving.saveNumber(str, this.loadNumber(slotId + "." + str));
        }
        
        // Load strings
        for(var str in Saving.getAllStrings()){
            Saving.saveString(str, this.loadString(slotId + "." + str));
        }
        
        // No error, return true
        return true;
    }
    
    export function save(slotId: string): boolean{
        try{
            // Set the date on the slotId localStorage item
            localStorage.setItem(slotId, getDateAsString());
            
            // Save bools
            for(var str in Saving.getAllBools()){
                localStorage.setItem(slotId + "." + str, Saving.boolToString(Saving.getAllBools()[str]));
            }
            
            // Save numbers
            for(var str in Saving.getAllNumbers()){
                localStorage.setItem(slotId + "." + str, Saving.numberToString(Saving.getAllNumbers()[str]));
            }
            
            // Save strings
            for(var str in Saving.getAllStrings()){
                localStorage.setItem(slotId + "." + str, Saving.getAllStrings()[str]);
            }
        }
        catch(e){
            if(e == DOMException.QUOTA_EXCEEDED_ERR){
                 console.log("Quota exceeded error : we're trying to save some data through HTML5's web storage, but we don't have enough space to save what we want.");
            }
            
            // We return false, since there was an error
            return false;
        }
        
        // No error, return true
        return true;
    }
    
    export function supportsLocalSaving(): boolean{
        if('localStorage' in window && window['localStorage'] !== null)
            return true;
        return false;
    }
    
    // Private functions
    function getDateAsString(): string{
        var currentdate: Date = new Date();
        return (currentdate.getDate() < 10? "0":"") // 0 before day
             + currentdate.getDate() // Day
             + "/"
             + (currentdate.getMonth()+1 < 10? "0":"") // 0 before month
             + (currentdate.getMonth()+1) // month
             + "/" 
             + currentdate.getFullYear() // year
             + " @ "  
             + (currentdate.getHours() < 10? "0":"") // 0 before hours
             + currentdate.getHours() // hour
             + ":"
             + (currentdate.getMinutes() < 10? "0":"") // 0 before minutes
             + currentdate.getMinutes() // minutes
             + ":" 
             + (currentdate.getSeconds() < 10? "0":"") // 0 before seconds
             + currentdate.getSeconds(); // seconds
    }
    
    export function loadBool(key: string): boolean{
        return Saving.stringToBool(localStorage.getItem(key));
    }
    
    export function loadNumber(key: string): number{
        return Saving.stringToNumber(localStorage.getItem(key));
    }
    
    export function loadString(key: string): string{
        return localStorage.getItem(key);
    }
}
