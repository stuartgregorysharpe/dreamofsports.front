import { Component, Inject, Optional } from "@angular/core";
import { RESPONSE } from "@nguniversal/express-engine/tokens";
import { CAppService } from "src/app/common/services/app.service";

@Component({
    selector: "error404-page",
    templateUrl: "error404.page.html",
})
export class CError404Page {
    constructor(
        private appService: CAppService, 
        @Optional() @Inject(RESPONSE) private response: any,       
    ) {}        

    public ngOnInit(): void {  
        this.initStatus();      
        this.initSEO();  
    }

    private initStatus(): void {
        if (this.appService.isServer) {           
            this.response.statusCode = 404;
        }         
    }
    
    private initSEO(): void {
        this.appService.setTitle("404");  
        this.appService.setMeta("name", "description", null);      
    }   
}
