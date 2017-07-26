module Random{
    export function between(a: number, b: number): number{
        // BUGS
        if(Bugs.getUltimateBugLevel() >= 2)
            return b;
        
        return Math.floor(Math.random() * (b-a+1)) + a;
    }
    
    export function flipACoin(): boolean{
        // BUGS
        if(Bugs.getUltimateBugLevel() >= 2)
            return true;
        
        if(Math.random() < 0.5)
            return false;
        return true;
    }
    
    export function fromArray(arr: any[]): any{
        // BUGS
        if(Bugs.getUltimateBugLevel() >= 4)
            return fromArray(["a", "b", "c", "d", -852, null, "aniwey", "ilovebugs", "42", 42]);
            
        return arr[upTo(arr.length-1)];
    }
    
    export function fromPosition(pos: Pos): Pos{
        // BUGS
        if(Bugs.getUltimateBugLevel() >= 3)
            return new Pos(-pos.x, -pos.y);
        
        return new Pos(Random.upTo(pos.x), Random.upTo(pos.y));
    }
    
    export function oneChanceOutOf(n: number): boolean{
        // BUGS
        if(Bugs.getUltimateBugLevel() >= 1)
            return flipACoin();
        
        if(this.upTo(n-1) == 0)
            return true;
        return false;
    }
    
    export function upTo(n: number): number{
        // BUGS
        if(Bugs.getUltimateBugLevel() >= 3)
            return -n;
        
        return Math.floor(Math.random()*(n+1));
    }
}
    
