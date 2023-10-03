import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CSimplePage } from "../../simple.page";
import { CAppService } from "src/app/common/services/app.service";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { ActivatedRoute, Router } from "@angular/router";
import { CAuthService } from "src/app/common/services/auth.service";
import { TUserType } from "src/app/model/dto/user.authdata.interface";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
    selector: "account-page",
    templateUrl: "account.page.html",
    styleUrls: ["account.page.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CAccountPage extends CSimplePage implements OnInit {
    constructor(
        protected appService: CAppService,
        protected authSerivce: CAuthService,
        protected pageRepository: CPageRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService
    ) 
    {
        super(appService, pageRepository, route, router, deviceDetector);
    }

    get userType(): TUserType {return this.authSerivce.authData.type;}
    get itemId(): number {return this.route.snapshot.params["item_id"] ? parseInt(this.route.snapshot.params["item_id"]) : null;}

    public async ngOnInit(): Promise<void> {
        this.route.params.subscribe(p => this.preinitPage(p["subpage"] || `${this.userType}-index`));        
    }

    private async preinitPage(slug: string): Promise<void> {
        if (slug !== this.page?.slug) {
            this.initScroll();                
            await this.initPage(slug);  
        }
        
        this.initSEO();
    }
}