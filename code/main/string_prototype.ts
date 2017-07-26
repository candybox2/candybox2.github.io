interface String{
    addAt(index: number, text: string): string;
    addChineseSpaces(): string;
    fillWith(characters: string, howMuch: number): string;
    replaceAt(index: number, text: string): string;
}

String.prototype.addAt = function(index: number, text: string): string{
    return this.substr(0, index) + text + this.substr(index);
}

String.prototype.addChineseSpaces = function(): string{
    var newStr: string = "";
    for(var i = 0; i < Math.floor(this.length/3); i++){
        newStr += " ";
    }
    newStr += this;
    for(var i = 0; i < Math.floor(this.length/3); i++){
        newStr += " ";
    }
    return newStr;
}

String.prototype.fillWith = function(characters: string, howMuch: number): string{
    var str: string = "";
    for(var i = 0; i < howMuch; i++){
        str += characters;
    }
    return this.concat(str);
}

String.prototype.replaceAt = function(index: number, text: string): string{
    return this.substr(0, index) + text + this.substr(index + text.length);
}