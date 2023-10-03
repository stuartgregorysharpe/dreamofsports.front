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
    selector: "athlets-page",
    templateUrl: "athlets.page.html",
    styleUrls: ["athlets.page.scss"],
})
export class CAthletsPage extends CSimplePage {
    public cat: ICat = undefined;

    constructor(
        protected appService: CAppService,
        protected filterService: CAthletsFilterService,
        protected pageRepository: CPageRepository,
        protected catRepository: CCatRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService
    ) 
    {
        super(appService, pageRepository, route, router, deviceDetector);
    }

    get h1(): string {return this.catSlug ? this.cat?.h1[this.lang.slug] || this.cat?.name[this.lang.slug] || "&nbsp;" : this.page?.h1[this.lang.slug] || this.page?.name[this.lang.slug] || "&nbsp;";} 
    get title(): string {return this.catSlug ? this.cat?.title[this.lang.slug] || this.cat?.name[this.lang.slug] : this.page?.title[this.lang.slug] || this.page?.name[this.lang.slug];} 
    get description(): string {return this.catSlug ? this.cat?.description[this.lang.slug] : this.page?.description[this.lang.slug];} 
    get catSlug(): string {return this.route.snapshot.params["cat"];}    

    public async ngOnInit(): Promise<void> {
        this.initScroll(); 
        await this.initPage('catalogue');        
        this.route.params.subscribe(async p => {
            this.filterService.filter.cat_slug = p['cat'];              
            await this.initCat(p['cat']);
            this.initSEO();
        });
    }

    private async initCat(slug: string): Promise<void> {
        try {
            if (!slug) {
                this.cat = null;                  
            } else if (slug !== this.cat?.slug) {
                this.cat = await this.catRepository.loadOne(slug);
            }
        } catch (err) {
            err === 404 ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`) : this.appService.notifyError(err);
        }
    }
}