///<reference path="Place.ts"/>

Saving.registerBool("lighthousePuzzleDone", false);

class Lighthouse extends Place{
    // The render area
    private renderArea: RenderArea = new RenderArea();
    
    // Array of questions (["id", "text", "id", "text"...])
    private questionsArray: string[];
    
    // Selected question id
    private selectedQuestionId: string = "lighthouseQuestionWho";
    
    // Speech id
    private speechId: string = null;
    
    // Show the puzzle?
    private showPuzzle: boolean = false;
    
    // The puzzle
    private puzzle: LighthousePuzzle = null;
    
    // Constructor
    constructor(game: Game){
        super(game);
        
        // We create the questions array
        this.createQuestionsArray();
        
        // We resize and update
        this.renderArea.resizeFromArray(Database.getAscii("places/lighthouse/lighthouse"), 0, 4); // 4 in order to add a space below the lighthouse, so that it looks nicer
        this.update();
    }
    
    // getRenderArea()
    public getRenderArea(): RenderArea{
        return this.renderArea;
    }
    
    // Public methods
    public update(): void{
        // Erase everything
        this.renderArea.resetAllButSize();
        
        // Back to the map button
        this.addBackToMainMapButton(this.renderArea, "lighthouseBackToTheMapButton");
        
        // Draw the lighthouse
        this.renderArea.drawArray(Database.getAscii("places/lighthouse/lighthouse"), 0, 3);
        
        // Add the questions list
        this.renderArea.addList(1, 55, 7, "lighthouseQuestionsList", new CallbackCollection(this.questionSelected.bind(this)), this.questionsArray);
        
        // Add the ask button and the link
        this.renderArea.addAsciiRealButton(Database.getText("lighthouseAskButton"), 5, 10, "lighthouseAskButton", Database.getTranslatedText("lighthouseAskButton"));
        this.renderArea.addLinkCall(".lighthouseAskButton", new CallbackCollection(this.ask.bind(this)));
        
        // Draw the speech if there's a speech id
        if(this.speechId != null){
            this.renderArea.drawSpeech(Database.getText(this.speechId), 17, 75, 99, "lighthouseSpeech", Database.getTranslatedText(this.speechId));
        }
        
        // If we should show the puzzle
        if(this.showPuzzle){
            // Create the puzzle if it's not done yet
            if(this.puzzle == null)
                this.puzzle = new LighthousePuzzle(this);
            // Draw it
            this.puzzle.draw(this.renderArea, new Pos(2, 12));
            // Add the reset button
            this.renderArea.addAsciiRealButton(Database.getText("lighthousePuzzleResetButton"), 2, 34, "lighthousePuzzleResetButton", Database.getTranslatedText("lighthousePuzzleResetButton"));
            this.renderArea.addLinkCall(".lighthousePuzzleResetButton", new CallbackCollection(this.resetPuzzle.bind(this)));
        }
        
        // Add the link which will call the selectRightQuestion method after the html dom is created
        this.renderArea.addLinkCallbackCollection(new CallbackCollection(this.selectRightQuestion.bind(this)));
    }
    
    // Public getters
    public getPuzzle(): LighthousePuzzle{
        return this.puzzle;
    }
    
    // Public setters
    public setSpeechId(speechId: string): void{
        this.speechId = speechId;
    }
    
    // Private methods
    private addQuestion(id: string, text: string, translatedText: string = null): void{
        this.questionsArray.push(id);
        
        if(translatedText == null)
            this.questionsArray.push(text);
        else
            this.questionsArray.push(text + (translatedText != ""? " (" + translatedText + ")":""));
    }
    
    private ask(): void{
        this.speechId = this.selectedQuestionId + "Speech";
        if(this.selectedQuestionId == "lighthouseQuestionDragon") this.showPuzzle = true;
        else this.showPuzzle = false;
        this.update();
        this.getGame().updatePlace();
    }
    
    private createQuestionsArray(): void{
        // We empty the array
        this.questionsArray = [];
        
        // Add the first basic questions
        this.addQuestion("lighthouseQuestionWho", Database.getText("lighthouseQuestionWho"), Database.getTranslatedText("lighthouseQuestionWho"));
        this.addQuestion("lighthouseQuestionWhat", Database.getText("lighthouseQuestionWhat"), Database.getTranslatedText("lighthouseQuestionWhat"));
        this.addQuestion("lighthouseQuestionWhyEatCandies", Database.getText("lighthouseQuestionWhyEatCandies"), Database.getTranslatedText("lighthouseQuestionWhyEatCandies"));
        this.addQuestion("lighthouseQuestionCandyBox", Database.getText("lighthouseQuestionCandyBox"), Database.getTranslatedText("lighthouseQuestionCandyBox"));
        
        // Add the question about the dragon is we unlocked it
        if(Saving.loadBool("dragonUnlockedCyclops")){
            this.addQuestion("lighthouseQuestionDragon", Database.getText("lighthouseQuestionDragon"), Database.getTranslatedText("lighthouseQuestionDragon"));
        }
    }
    
    private questionSelected(): void{
        // Get the selected language id
        this.selectedQuestionId = $("#lighthouseQuestionsList").find(":selected").attr("id");
        
        // Update the ligthouse
        this.update();
        this.getGame().updatePlace();
    }
    
    private resetPuzzle(): void{
        // Re create the puzzle
        this.puzzle = new LighthousePuzzle(this);
        
        // Update
        this.update();
        this.getGame().updatePlace();
    }
    
    private selectRightQuestion(): void{
        // We select the right question
        $("#" + this.selectedQuestionId).prop('selected', true);
    }
}