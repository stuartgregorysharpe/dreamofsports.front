import { Component } from "@angular/core";
import { ICat } from "src/app/model/entities/cat.interface";
import { CAppService } from "src/app/common/services/app.service";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { CCatRepository } from "src/app/common/services/repositories/cat.repository";
import { ActivatedRoute, Router } from "@angular/router";
import { CSimplePage } from "src/app/pages/simple.page";
import { CAthletsFilterService } from "src/app/common/services/athlets-filter.service";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
    selector: "search-page",
    templateUrl: "search.page.html",
    styleUrls: ["search.page.scss"],
})
export class CSearchPage extends CSimplePage {
    constructor(
        protected appService: CAppService,
        protected pageRepository: CPageRepository,
        protected catRepository: CCatRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService
    ) 
    {
        super(appService, pageRepository, route, router, deviceDetector);
    }

    get h1(): string {return this.page?.h1[this.lang.slug] || this.page?.name[this.lang.slug] || "&nbsp;";} 
    get title(): string {return this.page?.title[this.lang.slug] || this.page?.name[this.lang.slug];} 
    get description(): string {return this.page?.description[this.lang.slug];} 
    get query(): string {return this.route.snapshot.fragment;}    

    public async ngOnInit(): Promise<void> {
        this.initScroll(); 
        await this.initPage('search');        
        this.route.params.subscribe(async p => this.initSEO());
    }    
}