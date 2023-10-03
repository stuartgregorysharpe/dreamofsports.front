import { Component, OnInit } from "@angular/core";
import { CSimplePage } from "../../simple.page";

@Component({
    selector: "about-page",
    templateUrl: "about.page.html",
    styleUrls: ["about.page.scss"],
})
export class CAboutPage extends CSimplePage implements OnInit {
    public async ngOnInit(): Promise<void> {
        this.initScroll(); 
        await this.initPage('about');        
        this.route.params.subscribe(p => this.initSEO());  
    }
}
