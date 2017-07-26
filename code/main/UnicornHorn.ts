///<reference path="GridItem.ts"/>

class UnicornHorn extends GridItem{
    public update(player: Player, quest: Quest): void{
        player.heal(3);
    }
}