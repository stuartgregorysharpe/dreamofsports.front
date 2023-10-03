import { Component, OnInit } from "@angular/core";
import { CSimplePage } from "../simple.page";

@Component({
    selector: "static-page",
    templateUrl: "static.page.html",
})
export class CStaticPage extends CSimplePage implements OnInit {
    public async ngOnInit(): Promise<void> { 
        this.route.params.subscribe(async p => {
            if (p["page"] !== this.page?.slug) {
                this.initScroll();
                await this.initPage(p["page"]);  
            }
            this.initSEO();
        });
    }
}
