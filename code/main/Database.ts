///<reference path="./../../libs/jquery.d.ts"/>

module Database{
    // Variables
    var asciiMap: { [s: string]: string[]; } = {}; // A map which associates strings (the keys) to array of strings (the ascii arts)
    var asciiSizeMap: { [s: string]: Pos; } = {}; // A map which associates strings (the keys) to the sizes of ascii arts
    var textMap: { [s: string]: string; } = {}; // A map which associated strings (the keys) to strings (the texts)

    // Public functions
    export function addAscii(asciiName: string, width: number, height: number, asciiArray: string[]): void{
        asciiMap[asciiName] = asciiArray;
        asciiSizeMap[asciiName] = new Pos(width, height);
    }
    
    export function addText(key: string, text: string): void{
        textMap[key] = text;
    }
    
    export function isTranslated(): boolean{
        if(Saving.loadString("gameLanguage") != "en")
            return true;
        return false;
    }
    
    // Public getters
    export function getAscii(key: string): string[]{
        if(asciiMap[key] == null)
            console.log("Error : trying to access the unknown ascii art \"" + key + "\"");
        
        return asciiMap[key];
    }
    
    export function getAsciiHeight(key: string): number{
        return asciiSizeMap[key].y;
    }
    
    export function getAsciiWidth(key: string): number{
        return asciiSizeMap[key].x;
    }
    
    export function getPartOfAscii(key: string, y1: number, y2: number): string[]{
        return getAscii(key).slice(y1, y2);
    }
    
    export function getText(key: string): string{
        if(textMap["en." + key] == null)
            console.log("Error : trying to access the unknown text \"" + key + "\"");
        
        return textMap["en." + key];
    }
    
    export function getTranslatedText(key: string): string{
        // If we have a language (other than english) selected
        if(Saving.loadString("gameLanguage") != "en"){
            // If the translated text can't be found
            if(textMap[Saving.loadString("gameLanguage") + "." + key] == null)
                console.log("Error : trying to access the unknown translated text \"" + key + "\" for language " + Saving.loadString("gameLanguage") + "."); // Error
            // If the translated text isn't chinese
            if(Saving.loadString("gameLanguage") != "zh")
                return textMap[Saving.loadString("gameLanguage") + "." + key]; // We just return the text
            // Else, the translated text is chinese
            else
                return textMap[Saving.loadString("gameLanguage") + "." + key].addChineseSpaces(); // We return the text after adding spaces
        }
        
        // Else, we return an empty string
        return "";
    }
}
