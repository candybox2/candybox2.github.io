class CollisionBoxCollection{
    // Array of collision boxes
    boxes: CollisionBox[];
    
    // Constructor
    constructor(...boxes: CollisionBox[]){
        this.boxes = boxes;
    }
    
    // Public method
    public addCollisionBox(collisionBox: CollisionBox): void{
        this.boxes.push(collisionBox);
    }
    
    public collidesWith(collisionBoxCollection: CollisionBoxCollection, pos: Pos = new Pos(0, 0)): boolean{
        // We test if one of our boxes collide with one of the boxes of the collection given in parameters
        for(var i = 0; i < this.boxes.length; i++){
            for(var j = 0; j < collisionBoxCollection.getBoxes().length; j++){
                // If there's a collision between those two, we return true
                if(this.boxes[i].collidesWith(collisionBoxCollection.getBoxes()[j], pos))
                    return true;
            }
        }
        
        // No collision, we return false
        return false;
    }
    
    public move(pos: Pos): void{
        // We move each collision box
        for(var i = 0; i < this.boxes.length; i++){
            this.boxes[i].move(pos);
        }
    }
    
    public removeBoxes(): void{
        this.boxes = [];
    }
    
    // Public getters
    public getBoxes(): CollisionBox[]{
        return this.boxes;
    }
}
