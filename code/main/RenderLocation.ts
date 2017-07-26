///<reference path="./../../libs/jquery.d.ts"/>

class RenderLocation{
    private locationString: string;
    private scrolling: boolean = null;

    // Constructor
    constructor(locationString: string, scrolling: boolean = false){ // Not activated by default
        this.setLocationString(locationString);
        this.setScrolling(scrolling);
    }

    // Public methods
    public render(renderArea: RenderArea): void{
        $(this.locationString).html(renderArea.getForRendering());
        renderArea.runLinks();
    }
    
    public setContentGap(gap: number): void{
        var ex: number, outerWidth: number, addGap: number = 0;
        
        // Get our outer width
        outerWidth = $(this.locationString).outerWidth();
        
        // Get the real ex value
        ex = this.getRealExValueFromTheStatusBar();
            
        // If our outerWidth is bigger than the window, calc an additional gap
        if(outerWidth > $(window).width())
            addGap = -(outerWidth-$(window).width())/2;

        // Finally change the "left" value of our div
        $(this.locationString).css({"left" : ((gap/2)*ex+addGap).toString() + "px"});
    }

    // Public setters    
    public setLocationString(locationString: string): void{
        this.locationString = locationString;
    }

    public setScrolling(scrolling: boolean, defaultScroll: number = 0): void{
        // If the scrolling is different
        if(this.scrolling != scrolling){
            this.scrolling = scrolling;
            
            // We initialize or stop scrolling, depending on the new scrolling value
            if(this.scrolling) this.initScrolling(defaultScroll);
            else this.stopScrolling();
        }
    }
    
    // Public getters
    public getScroll(): number{
        return $("html").scrollTop();
    }
    
    public getScrolling(): boolean{
        return this.scrolling;
    }
    
    // Private methods
    private getRealExValueFromTheStatusBar(): number{
        // DISCLAIMER
        // Yes, I know that this method is really ugly
        // But if I don't do this way, there are some stupid gaps in long quests and the browser zooms in and out (or even without zooming in Chrome)
        // If anyone has a better cross-browser solution, please tell me!
            
        // Return the real "ex" value in pixels
        return $("#statusBar").outerWidth() / 100;
    }
    
    private initScrolling(defaultScroll: number): void{
        // Scroll to the default scroll
        $("html").scrollTop(defaultScroll);
        
        // Set css for our location string
        $(this.locationString).css({
            'position' : 'absolute',
            'left' : '0', // With this, the scrolling place (the map for example) is sticked to the left of the page
            'top' : '0', // With this, the scrolling place (the map for example) go below the status bar
            'overflow-x' : 'scroll'
        });
        
        // Set css for around the status bar
        $("#aroundStatusBar").css({
            'position' : 'fixed',
            'top' : '0',
            'left' : '0',
            'right' : '0',
            'height' : '0'
        });
    }
    
    private stopScrolling(): void{
        // Set the scroll to 0
        $("html").scrollTop(0);
        
        // Reset css for our location string
        $(this.locationString).css({
            'position' : 'relative',
            'overflow-x' : 'hidden'
        });
        
        // Reset css for around the status bar
        $("#aroundStatusBar").css({
            'position' : 'relative',
            'top' : 'auto',
            'left' : 'auto',
            'right' : 'auto',
            'height' : 'auto'
        });
    }
}
