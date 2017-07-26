///<reference path="GridItem.ts"/>

class Feather extends GridItem{
    public getDatabaseDescriptionName(): string{
        // If we don't have the pogo stick yet, we return a special message
        if(Saving.loadBool("gridItemPossessedPogoStick") == false)
            return "gridItemFeatherDescriptionNoPogoStick";
        
        // Else we return the normal description name
        return super.getDatabaseDescriptionName();
    }
}