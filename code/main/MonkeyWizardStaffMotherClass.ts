///<reference path="EqItem.ts"/>

class MonkeyWizardStaffMotherClass extends EqItem{
    // Public methods which the daughter classes can use
    public castPurpleBall(player: Player, quest: Quest, target: QuestEntity, speed: Pos = new Pos(2, 1)): void{
        var ball: Fireball = new Fireball(quest,
                                          player.getSpellCastingPosition(),
                                          new Naming("An magical purple ball", "a magical purple ball"),
                                          new Color(ColorType.MONKEY_WIZARD_BALL),
                                          new Pos(2, 1),
                                          15,
                                          player.getAndPossiblyCreateSpellCastingDamageReason(new Naming("An magical purple ball", "a magical purple ball"))
                                          );
        
        // Set the target
        ball.setTargetTypeTargetEntity(target, null, speed);
        
        // Add it to the quest
        quest.addEntity(ball);
    }
    
    public getRandomEnemy(player: Player, quest: Quest): QuestEntity{
        // Array which will contain the indices (in the entities array) of all possible enemies
        var indices: number[] = [];
        
        // Fill the indices array
        for(var i = 0; i < quest.getEntities().length; i++){
            // If this entity is destructible and is from a different team then the player
            if(quest.getEntities()[i].getDestructible() && quest.getEntities()[i].getTeam() != player.getTeam()){
                // We add its index
                indices.push(i);
            }
        }
        
        // We return a random entity from the indices index
        if(indices.length > 0) return quest.getEntities()[indices[Random.between(0, indices.length-1)]];
        else return null;
    }
}