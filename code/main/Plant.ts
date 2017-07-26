///<reference path="QuestEntity.ts"/>

class Plant extends QuestEntity{
    // Constructor
    constructor(quest: Quest, leftDownCornerPosition: Pos, minPlantNumber: number, maxPlantNumber: number){
        // Set the ascii art name
        var asciiArtName: string = "places/quests/theSea/plant" + Random.between(minPlantNumber, maxPlantNumber).toString();
        
        // Create the real global position
        var globalPosition: Pos = leftDownCornerPosition;
        globalPosition.add(new Pos(0, -Database.getAsciiHeight(asciiArtName)+1));
        
        // Call the mother constructor
        super(quest,
              globalPosition,
              new Naming("A plant", "a plant"),
              new RenderArea()
             );
        
        // Draw the ascii art
        this.getRenderArea().resizeFromArray(Database.getAscii(asciiArtName));
        this.getRenderArea().drawArray(Database.getAscii(asciiArtName));
        
        // Set different transparency settings depending on the ascii art
        if(asciiArtName == "places/quests/theSea/plant0" || asciiArtName == "places/quests/theSea/plant8" || asciiArtName == "places/quests/theSea/plant9" || asciiArtName == "places/quests/theSea/plant10"){
            this.setTransparency(new RenderTransparency(" ", "%"));
        }
        else{
            this.setTransparency(new RenderTransparency(" "));
        }
    }
}