///<reference path="QuestEntitySpell.ts"/>

class PlayerSummonedDemon extends QuestEntitySpell{
    // The damage collision box collection
    private damageCollisionBoxCollection: CollisionBoxCollection;
    
    // The damage we inflict
    private damage: number;
    
    // The damage reason
    private damageReason: QuestEntityDamageReason;
    
    // Constructor
    constructor(quest: Quest, globalPosition: Pos, damage: number){
        super(quest,
              globalPosition,
              new Naming("A demon", "a demon")
        );
        
        // Set the damage
        this.damage = damage;
        
        // Create the damage reason
        this.damageReason = new QuestEntityDamageReason(QuestEntityDamageReasonWhoType.ENTITY, QuestEntityDamageReasonWhatType.SPELL);
        this.damageReason.setQuestEntity(this.getQuest().getGame().getPlayer(), QuestEntityTeam.NATURE);
        this.damageReason.setSpellNaming(this.getRandomNaming());
        
        // Create the collision box collection
        this.damageCollisionBoxCollection = new CollisionBoxCollection(new CollisionBox(this, new Pos(0, 0), new Pos(8, 4)));
        
        // Add the demon colors randomly
        this.addRandomQuestEntitySpellColors();
        
        // Add the quest entity movement
        this.setQuestEntityMovement(new QuestEntityMovement(new Pos(3, 0)));
    }
    
    // Public methods
    public update(): void{
        // Handle damage
        this.handleDamage();
        
        // Update
        super.update();
    }
    
    // Private generation methods
    private addRandomQuestEntitySpellColors(): void{
        // Array of 4*4 used to decide of the colors to add
        var arr: boolean[][] = [];
        
        // Fill the array with false values
        for(var i = 0; i < 4; i++){
            arr.push([]);
            for(var j = 0; j < 4; j++){
                arr[i].push(false);
            }
        }
        
        // Fill the array with some true values
        switch(Random.upTo(1)){
            // Symmetrical demon (vertical symmetry)
            case 0:
                for(var i = 0; i < 2; i++){
                    for(var j = 0; j < 4; j++){
                        if(Random.flipACoin()){
                            arr[i][j] = true;
                            arr[3-i][j] = true;
                        }
                    }
                }
            break;
            // Symmetrical demon (horizontal symmetry)
            case 1:
                for(var i = 0; i < 4; i++){
                    for(var j = 0; j < 2; j++){
                        if(Random.flipACoin()){
                            arr[i][j] = true;
                            arr[i][3-j] = true;
                        }
                    }
                }
            break;
        }
        
        // Add the colors depending on the array's content
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                // If we should add a color here, we do so
                if(arr[i][j])
                    this.addColor(new QuestEntitySpellColor(this.getQuest(), new Pos(i*2, j), new Pos(2, 1), new Color(ColorType.PLAYER_SUMMONED_DEMON, true)));
            }
        }
    }
    
    private getRandomNaming(): Naming{
        // The final name in a string
        var finalName: string = "";
        
        // How many syllables?
        var howManySyllables: number;
        if(Random.flipACoin()) howManySyllables = 3; // a lot of chance
        else if(Random.oneChanceOutOf(10)) howManySyllables = 4; // small chance
        else if(Random.oneChanceOutOf(10)) howManySyllables = 1; // small chance
        else howManySyllables = 2; // a lot of chance, a but still a little bit less chance then 3 syllables
        
        // The syllables array
        var syllablesArray: string[] = [];
        
        // Add the syllables to the array
        for(var i = 0; i < howManySyllables; i++){
            syllablesArray.push(Random.fromArray(["lael", "ezek", "bal", "sen", "zen", "aps", "hir", "ta", "ozn", "eres", "non", "enon", "cesti", "mal", "aser", "oex", "nax", "arir", "nikon", "taor", "rael", "mael", "sael", "epit", "uer", "pod", "ehon", "edeo", "xa"]));
        }
        
        // Turn the first letter of the firsy syllable into upper case
        syllablesArray[0] = syllablesArray[0].charAt(0).toUpperCase() + syllablesArray[0].slice(1);
        
        // Create the final name from the syllables
        for(var i = 0; i < syllablesArray.length; i++){
            finalName += syllablesArray[i];
        }
        
        // Finally return the naming
        return new Naming("the demon " + finalName);
    }
    
    // Other private methods
    private handleDamage(): void{
        // We iterate over entities
        for(var i = 0; i < this.getQuest().getEntities().length; i++){
            // If it is destructible
            if(this.getQuest().getEntities()[i].getDestructible()){
                // If it has a collision box collection
                if(this.getQuest().getEntities()[i].getCbc() != null){
                    // If this collision box collection collides with ours
                    if(this.getQuest().getEntities()[i].getCbc().collidesWith(this.damageCollisionBoxCollection)){
                        // We inflict the damage
                        this.getQuest().getEntities()[i].inflictDamage(this.damage, this.damageReason);
                    }
                }
            }
        }
    }
}