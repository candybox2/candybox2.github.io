///<reference path="Place.ts"/>

class TheComputer extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Is the computer on or off?
    private on: boolean;
    
    // The lines
    private lines: TheComputerLine[] = [];
    
    // The current computer state
    private state: TheComputerState;
    
    // The current command text
    private currentCommandText = "";
    
    // Did we already add hotkeys?
    private hotkeysAdded: boolean = false;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // Resize and update
        this.renderArea.resize(100, 40);
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // willStopBeingDisplayed()
    public willStopBeingDisplayed(): void{
        this.getGame().setIsStatusBarAllowedToUseTheNKey(true); // The status bar can use the n key now
    }
    
    // Private methods
    private addHotkeys(): void{
        // Hotkeys are added now
        this.hotkeysAdded = true;
        
        // Add the enter hotkey
        this.getGame().addHotkey(new Hotkey("enter", new CallbackCollection(this.pressedEnter.bind(this))));
        
        // Add hotkeys for each letter from a to z
        for(var i = 97; i <= 122; i++){
            this.getGame().addHotkey(new Hotkey(String.fromCharCode(i), new CallbackCollection(this.pressedKey.bind(this, String.fromCharCode(i)))));
        }
        
        // Same thing for the numbers from 0 to 9
        for(var i = 48; i <= 57; i++){
            this.getGame().addHotkey(new Hotkey(String.fromCharCode(i), new CallbackCollection(this.pressedKey.bind(this, String.fromCharCode(i)))));
            this.getGame().addHotkey(new Hotkey("numpad" + String.fromCharCode(i), new CallbackCollection(this.pressedKey.bind(this, String.fromCharCode(i)))));
        }
        
        // Add the hotkey for the space key
        this.getGame().addHotkey(new Hotkey("space", new CallbackCollection(this.pressedKey.bind(this, " "))));
        
        // Add the hotkey for the delete key
        this.getGame().addHotkey(new Hotkey("delete", new CallbackCollection(this.pressedDelete.bind(this))));
    }
    
    private addLine(line: TheComputerLine): void{
        this.lines.push(line);
    }
    
    private addMisunderstood(): void{
        this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "This command was misunderstood. Try \"help\" for a list of available commands."));
    }
    
    private draw(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Draw the computer
        this.renderArea.drawArray(Database.getAscii("general/theComputer/computer"), 19, 0);
        
        // Draw the on button
        this.drawOnButton(69, 14);
        
        // Draw the lines
        this.drawLines(22, 16, 6);
    }
    
    private drawOnButton(x: number, y: number): void{
        // Draw the button
        this.renderArea.addMultipleAsciiButtons("theComputerOnButton",
                                                x + 1, x + 4, y,
                                                x, x + 5, y + 1,
                                                x + 1, x + 4, y + 2);
        
        // Add the link
        this.renderArea.addLinkCall(".theComputerOnButton", new CallbackCollection(this.switchOnOff.bind(this)));
    }
    
    private drawLines(x: number, y: number, minY: number): void{
        for(var i = this.lines.length-1; i >= 0; i--){
            // We add the return value to our y var because it returns the extra lines it used
            y -= this.lines[i].draw(this.renderArea, new Pos(x, y - (this.lines.length-1 - i)), minY);
        }
    }
    
    private executeCommand(commandText: string): void{
        // Create an array from the command words
        var words: string[] = commandText.split(" ");
        
        // Try to understand the command from the first word
        if(commandText.length > 0 && words.length > 0){
            switch(words[0]){
                // Some hidden commands :P
                case "no": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Yes!")); break;
                case "yes": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "No!")); break;
                case "aniwey": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "He made this game :)")); break;
                case "cedric": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "A nice guy who made the online saving system of the first Candy Box.")); break;
                case "17": case "dixsept": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "A beta tester and ascii artist. Some people say that he has a big nose. Don't listen to them.")); break;
                case "soinou": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "A beta tester. He also made the tab system of the first Candy Box.")); break;
                case "42": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The answer to the ultimate question of life, the universe, and everything.")); break;
                case "cp": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "No, you can't copy anything, sorry.")); break;
                case "rm": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "No, you can't remove anything, sorry.")); break;
                case "cd": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Where would you like to go anyway?")); break;
                case "ls": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, ". ..")); break;
                case "emacs": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The best text editor ever after vim.")); break;
                case "vim": case "vi": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The best text editor ever after emacs.")); break;
                case "nano": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Come on, do you seriously want to use this?")); break;
                case "startx": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Fatal server error: Cannot establish any listening sockets - Make sure an X server isn't already running")); break;
                case "mkdir": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Cannot create directory. No, you won't be given any precision.")); break;
                case "sudo": case "su": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "To gain root access, please use \"su -\". (hint : you can't type the \"-\")")); break;
                case "lol": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Haha. That's funny.")); break;
                case "pwd": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "/home/player")); break;
                case "mv": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "What would you like to move anyway?")); break;
                case "man": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Nah. Use help instead.")); break;
                case "pacman": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The best package manager ever.")); break;
                case "whoami": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "player")); break;
                case "tobias": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Tobias Nordqvist, an ascii artist. From sweden. Thanks to him!")); break;
                case "deinol": case "dani": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Dani \"Deinol\" Gómez, an ascii artist. Thanks to him!")); break;
                case "godsturf": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "GodsTurf, an ascii artist. Thanks to him!")); break;
                case "mlp": this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "PONIES PONIES PONIES PONIES PONIES PONIES PONIES PONIES PONIES PONIES")); break;
                // The help command
                case "help":
                    // If there's a second word
                    if(words.length > 1){
                        // If there's a third word, the command is incorrect
                        if(words.length > 2){
                            this.addMisunderstood();
                        }
                        // Else, no third word, we do something different depending on the second word
                        else{
                            switch(words[1]){
                                case "help":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The help command displays informations about other system commands."));
                                break;
                                case "add":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The add command allows you to add a given quantity of a given resource. Usage : \"add quantity resource\"."));
                                break;
                                case "quantity":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "A quantity is expressed by a number, which is composed of multiple figures."));
                                break;
                                case "resource":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "List of available resources : candies, lollipops, chocolatebars, painsauchocolat."));
                                break;
                                case "bug":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The bug command allows you to configure the bugs generated by the computer. Usage : \"bug type level\"."));
                                break;
                                case "type":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The bug type is the kind of bug you want to configure. Allowed types are \"graphical\", \"quest\" and \"ultimate\". Use \"help graphical\", \"help quest\" or \"help ultimate\" for more information."));
                                break;
                                case "graphical":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Graphical bugs only affect how the game display informations. They won't be kept after reloading your game."));
                                break;
                                case "quest":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Quest bugs affect the quests gameplay. Results are unexpected. They probably won't be kept after reloading your game."));
                                break;
                                case "ultimate":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Ultimate bugs can affect a lot of things. They will probably be kept after reloading your game, and they basically could destroy your save. Your browser may even crash. Be careful with them."));
                                break;
                                case "level":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The bug level describes how much the bugs will impact the game. Allowed values are 0, 1, 2, 3 and 4. 0 means no bug and 4 is the most powerful bug."));
                                break;
                                case "command":
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "No, you're not supposed to type \"help command\", you should type \"help bug\" or \"help add\" for example."));
                                break;
                                // Default : misunderstood
                                default:
                                    this.addMisunderstood();
                                break;
                            }
                        }
                    }
                    // Else, no second word
                    else{
                        this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "List of available commands : add, bug, help. Use \"help command\" to get more informations about a specific command. There are probably no hidden commands. I guess."));
                    }
                break;
                // The add command
                case "add":
                    // If there's a second word
                    if(words.length > 1){
                        // If there's a third word
                        if(words.length > 2){
                            // If there's a fourth word
                            if(words.length > 3){
                                // Misunderstood
                                this.addMisunderstood();
                            }
                            // Else, no fourth word
                            else{
                                // If the second word cannot be converted to a number
                                if(isNaN(parseFloat(words[1])))
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The quantity must be a number. See \"help quantity\" for more informations."));
                                // Else, if the third word isn't a valid resource
                                else if(words[2] != "candies" && words[2] != "lollipops" && words[2] != "chocolatebars" && words[2] != "painsauchocolat")
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The resource is invalid. See \"help resource\" for more informations."));
                                // Else, everything's okay
                                else{
                                    // Execute the command, depending on the resource given
                                    switch(words[2]){
                                        case "candies":
                                            this.getGame().getCandies().add(parseFloat(words[1]));
                                        break;
                                        case "lollipops":
                                            this.getGame().getLollipops().add(parseFloat(words[1]));
                                        break;
                                        case "chocolatebars":
                                            this.getGame().getChocolateBars().add(parseFloat(words[1]));
                                        break;
                                        case "painsauchocolat":
                                            this.getGame().getPainsAuChocolat().add(parseFloat(words[1]));
                                        break;
                                    }
                                    // Write the result
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, words[1] + " " + words[2] + " added successfully."));
                                }
                            }
                        }
                        // Else, no third word
                        else{
                            this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "You must give a resource. See \"help add\" for more informations."));
                        }
                    }
                    // Else, no second word
                    else{
                        this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "You must give a quantity. See \"help add\" for more informations."));
                    }
                break;
                // The bug command
                case "bug":
                    // If there's a second word
                    if(words.length > 1){
                        // If there's a third word
                        if(words.length > 2){
                            // If there's a fourth word
                            if(words.length > 3){
                                // Misunderstood
                                this.addMisunderstood();
                            }
                            // Else, no fourth word
                            else{
                                // If the second word isn't a valid type
                                if(words[1] != "graphical" && words[1] != "quest" && words[1] != "ultimate")
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The bug type is incorrect. See \"help type\" for more informations."));
                                // Else, if the third word isn't a valid level
                                else if(words[2] != "0" && words[2] != "1" && words[2] != "2" && words[2] != "3" && words[2] != "4")
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "The bug level is invalid. See \"help level\" for more informations."));
                                // Else, everything's okay
                                else{
                                    // Execute the command, depending on the type given
                                    switch(words[1]){
                                        case "graphical":
                                            Bugs.setGraphicalBugLevel(parseInt(words[2]));
                                        break;
                                        case "quest":
                                            Bugs.setQuestBugLevel(parseInt(words[2]));
                                        break;
                                        case "ultimate":
                                            Bugs.setUltimateBugLevel(parseInt(words[2]));
                                        break;
                                    }
                                    // Write the result
                                    this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "Bug type " + words[1] + " set successfully at level " + words[2] + "."));
                                }
                            }
                        }
                        // Else, no third word
                        else{
                            this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "You must give a bug level. See \"help level\" for more informations."));
                        }
                    }
                    // Else, no second word
                    else{
                        this.addLine(new TheComputerLine(TheComputerLineType.TEXT, "You must give a bug type. See \"help type\" for more informations."));
                    }
                break;
                // Default : misunderstood
                default:
                    this.addMisunderstood();
                break;
            }
        }
    }
    
    private pressedDelete(): void{
        // If we're currently waiting for a command
        if(this.state == TheComputerState.WAITING_FOR_COMMAND){
            // If the current command text contains at least one letter
            if(this.currentCommandText.length > 0){
                // We delete the last character
                this.currentCommandText = this.currentCommandText.slice(0, this.currentCommandText.length-1);
                
                // We update
                this.update();
                this.getGame().updatePlace();
            }
        }
    }
    
    private pressedEnter(): void{
        // Do something different depending on the current state
        switch(this.state){
            // If we were waiting for the return key
            case TheComputerState.WAITING_FOR_RETURN:
                // We change our state
                this.state = TheComputerState.WAITING_FOR_COMMAND;
                // We add an empty text line
                this.addLine(new TheComputerLine(TheComputerLineType.TEXT, ""));
                // We add an empty command line
                this.addLine(new TheComputerLine(TheComputerLineType.COMMAND, ""));
                // We update
                this.update();
                this.getGame().updatePlace();
            break;
            // If we were writing a command
            case TheComputerState.WAITING_FOR_COMMAND:
                // We try to execute the command
                this.executeCommand(this.currentCommandText);
                // We empty the current command text
                this.currentCommandText = "";
                // We add an empty text line
                this.addLine(new TheComputerLine(TheComputerLineType.TEXT, ""));
                // We add an empty command line
                this.addLine(new TheComputerLine(TheComputerLineType.COMMAND, ""));
                // We update
                this.update();
                this.getGame().updatePlace();
            break;
        }
    }
    
    private pressedKey(key: string): void{
        // If we're currently waiting for a command
        if(this.state == TheComputerState.WAITING_FOR_COMMAND){
            // Create an array of words from the current command text (for checking purposes)
            var words: string[] = this.currentCommandText.split(" ");
            
            // If the last word of the current command text isn't too big and the current command text itself isn't too big either
            if((words.length == 0 || words[words.length-1].length < 25 || key == " ") && this.currentCommandText.length < 100){
                // We add the letter to the command
                this.currentCommandText = this.currentCommandText + key;
                
                // We update
                this.update();
                this.getGame().updatePlace();
            }
        }
    }
    
    private switchOnOff(): void{
        // If the computer was on
        if(this.on){
            this.on = false; // Now it's off
            this.lines = []; // Clear the lines
            this.getGame().setIsStatusBarAllowedToUseTheNKey(true); // The status bar can use the n key now
        }
        // Else, if the computer was off
        else{
            this.on = true; // Now it's on
            // Add the first lines
            this.addLine(new TheComputerLine(TheComputerLineType.COMMAND, "Booting GNU/Candies system version 4.2... OK"));
            this.addLine(new TheComputerLine(TheComputerLineType.COMMAND, "Initializing the memory stack... OK"));
            this.addLine(new TheComputerLine(TheComputerLineType.COMMAND, "Checking every piece of the system is free software... OK"));
            this.addLine(new TheComputerLine(TheComputerLineType.TEXT, ""));
            this.addLine(new TheComputerLine(TheComputerLineType.CENTER, "Press return to continue"));
            // Set the current computer state
            this.state = TheComputerState.WAITING_FOR_RETURN;
            // The status bar isn't allowed to use the n key anymore
            this.getGame().setIsStatusBarAllowedToUseTheNKey(false);
            // If we didn't add hotkeys yet, we do so
            if(this.hotkeysAdded == false)
                this.addHotkeys();
        }

        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private update(): void{
        // If we have too much lines, delete some of them
        if(this.lines.length > 12){
            this.lines.splice(0, this.lines.length-12);
        }
        
        // If the last line type is COMMAND, we change its text by the current command text
        if(this.lines.length > 0 && this.lines[this.lines.length-1].getType() == TheComputerLineType.COMMAND){
            this.lines[this.lines.length-1].setLinesFromText(this.currentCommandText);
        }
        
        // Draw
        this.draw();
    }
}