class Color{
    // The color type
    private colorType: ColorType;
    
    // RGB values of the color (I find one-letter variables quite funny to look at actually)
    private r: number;
    private g: number;
    private b: number;
    
    // Should we invert the color when the player uses inverted colors ?
    private shouldInvert: boolean;
    
    // The actual color string which can be understood by CSS (also the inverted color string)
    private colorString: string;
    private invertedColorString: string;
    
    // Constructor
    constructor(colorType: ColorType, shouldInvert: boolean = false){
        this.setColorType(colorType);
        this.shouldInvert = shouldInvert;
    }
    
    // Public getters
    public getColorString(): string{
        // If the player doesn't use inverted colors or we don't need to invert
        if(Saving.loadBool("gameInvertedColors") == false || this.shouldInvert == false)
            return this.colorString;
        else
            return this.invertedColorString;
    }
    
    // Public setters
    public setColorType(colorType: ColorType): void{
        // Set the type
        this.colorType = colorType;
        
        // Set r, g, and b depending on the color type
        switch(this.colorType){
            // Health bars
            case ColorType.HEALTH_GREEN: this.setRGB(20, 212, 0); break;
            case ColorType.HEALTH_ORANGE: this.setRGB(255, 128, 0); break;
            case ColorType.HEALTH_RED: this.setRGB(230, 15, 0); break;
            case ColorType.HEALTH_UNICOLOR: this.setRGB(20, 212, 0); break;
            // Player spells
            case ColorType.PLAYER_FIREBALL: this.setRGB(255, 120, 0); break;
            case ColorType.PLAYER_ACID_DROP: this.setRGB(138, 172, 60); break;
            case ColorType.PLAYER_THORN: this.setRGB(85, 150, 40); break;
            case ColorType.PLAYER_OBSIDIAN_BRICK: this.setRGB(52, 0, 61); break;
            case ColorType.PLAYER_SUMMONED_DEMON: this.setRGB(0, 0, 0); break;
            // Eq items spells
            case ColorType.RED_ENCHANTED_GLOVES_FIREBALL: this.setRGB(255, 80, 0); break;
            // Quest buttons
            case ColorType.QUEST_BUTTON_ACID_RAIN: this.setRGB(138, 172, 60); break;
            case ColorType.QUEST_BUTTON_FIREBALL: this.setRGB(255, 120, 0); break;
            case ColorType.QUEST_BUTTON_TELEPORT: this.setRGB(185, 213, 213); break;
            case ColorType.QUEST_BUTTON_ERASE_MAGIC: this.setRGB(230, 255, 108); break;
            case ColorType.QUEST_BUTTON_THORNS_SHIELD: this.setRGB(85, 150, 40); break;
            case ColorType.QUEST_BUTTON_OBSIDIAN_WALL: this.setRGB(180, 90, 130); break;
            case ColorType.QUEST_BUTTON_BLACK_DEMONS: this.setRGB(128, 128, 128); break;
            case ColorType.QUEST_BUTTON_HEALTH_POTION: this.setRGB(255, 31, 31); break;
            case ColorType.QUEST_BUTTON_TURTLE_POTION: this.setRGB(123, 137, 13); break;
            case ColorType.QUEST_BUTTON_ANTI_GRAVITY_POTION: this.setRGB(187, 64, 188); break;
            case ColorType.QUEST_BUTTON_BERSERK_POTION: this.setRGB(110, 30, 47); break;
            case ColorType.QUEST_BUTTON_CLONING_POTION: this.setRGB(200, 200, 200); break;
            case ColorType.QUEST_BUTTON_P_POTION: this.setRGB(42, 135, 141); break;
            case ColorType.QUEST_BUTTON_X_POTION: this.setRGB(252, 82, 255); break;
            case ColorType.QUEST_BUTTON_SOME_OBJECT: this.setRGB(209, 131, 67); break;
            case ColorType.QUEST_BLACKHOLE_SPELL: this.setRGB(80, 80, 80); break;
            // Quest spells/potions countdown color
            case ColorType.QUEST_COUNTDOWN: this.setRGB(255, 0, 0); break;
            // Special colors used for the save page
            case ColorType.SAVE_GREEN: this.setRGB(42, 184, 39); break;
            case ColorType.SAVE_RED: this.setRGB(255, 28, 28); break;
            // Status bar special colors
            case ColorType.STATUS_BAR_SELECTED_TAB: this.setRGB(191, 191, 191); break;
            // Sea horse water ball
            case ColorType.SEAHORSE_WATER_BALL: this.setRGB(0, 58, 118); break;
            // The cave background color for the front exit
            case ColorType.THECAVE_BACKGROUND_COLOR: this.setRGB(20, 20, 20); break;
            // Secial color used by the monkey wizard
            case ColorType.MONKEY_WIZARD_BALL: this.setRGB(114, 0, 101); break;
            case ColorType.MONKEY_WIZARD_BALL_STORED: this.setRGB(114, 0, 56); break;
            // Special colors used in the forest quest
            case ColorType.TREE_SPIRIT_MAGIC_SPINE: this.setRGB(16, 95, 16); break;
            // Special color in the castle's dark room
            case ColorType.CASTLE_DARK_ROOM: this.setRGB(0, 0, 0); break;
            // Special colors for the shark fins
            case ColorType.BIGSHARK_FIN_RED: this.setRGB(217, 31, 31); break;
            case ColorType.BIGSHARK_FIN_GREEN: this.setRGB(31, 217, 64); break;
            case ColorType.BIGSHARK_FIN_PURPLE: this.setRGB(151, 31, 217); break;
            // Special colors for the blackhole spell
            case ColorType.BLACKHOLE_GREY20: this.setRGB(20, 20, 20); break;
            case ColorType.BLACKHOLE_GREY40: this.setRGB(40, 40, 40); break;
            case ColorType.BLACKHOLE_GREY60: this.setRGB(60, 60, 60); break;
            case ColorType.BLACKHOLE_GREY80: this.setRGB(80, 80, 80); break;
            case ColorType.BLACKHOLE_GREY100: this.setRGB(100, 100, 100); break;
            case ColorType.BLACKHOLE_GREY120: this.setRGB(120, 120, 120); break;
            case ColorType.BLACKHOLE_GREY140: this.setRGB(140, 140, 140); break;
            case ColorType.BLACKHOLE_GREY160: this.setRGB(160, 160, 160); break;
            case ColorType.BLACKHOLE_GREY180: this.setRGB(180, 180, 180); break;
            case ColorType.BLACKHOLE_GREY200: this.setRGB(200, 200, 200); break;
            case ColorType.BLACKHOLE_GREY220: this.setRGB(220, 220, 220); break;
            case ColorType.BLACKHOLE_GREY240: this.setRGB(240, 240, 240); break;
            // Special colors for the Hell quest
            case ColorType.HELL_RED_LAVA: this.setRGB(200, 8, 3); break;
            case ColorType.DEVIL_FIREBALL: this.setRGB(191, 0, 0); break;
            // Special colors for the developer quest
            case ColorType.DEVELOPER_BLUE: this.setRGB(20, 20, 213); break;
            case ColorType.DEVELOPER_YELLOW: this.setRGB(227, 194, 11); break;
            case ColorType.DEVELOPER_ORANGE: this.setRGB(201, 77, 9); break;
        }
    }
    
    // Private setters
    private setColorString(colorString: string): void{
        this.colorString = colorString;
    }
    
    private setInvertedColorString(invertedColorString: string): void{
        this.invertedColorString = invertedColorString;
    }
    
    private setRGB(r: number, g: number, b: number): void{
        // Set r, g and b
        this.r = r;
        this.g = g;
        this.b = b;
        
        // Set the color strings from r, g and b
        this.setColorString("rgb(" + r.toString() + ", " + g.toString() + ", " + b.toString() + ")");
        this.setInvertedColorString("rgb(" + (255-r).toString() + ", " + (255-g).toString() + ", " + (255-b).toString() + ")");
    }
}
