import { Component, OnInit } from "@angular/core";
import { CSimplePage } from "../../simple.page";

@Component({
    selector: "error401-page",
    templateUrl: "error401.page.html",    
})
export class CError401Page extends CSimplePage implements OnInit {
    public async ngOnInit(): Promise<void> {
        this.initScroll(); 
        await this.initPage('401');        
        this.route.params.subscribe(p => this.initSEO());  
    }
}