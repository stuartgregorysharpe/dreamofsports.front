import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { CAppService } from "src/app/common/services/app.service";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";
import { CSimplePage } from "src/app/pages/simple.page";

@Component({
    selector: "athlet-page",
    templateUrl: "athlet.page.html",
})
export class CAthletPage extends CSimplePage {
    public athlet: IAthletOut = null;

    constructor(
        protected appService: CAppService,
        protected pageRepository: CPageRepository,
        protected athletRepository: CAthletRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService
    ) 
    {
        super(appService, pageRepository, route, router, deviceDetector);
    }

    get h1(): string {return this.athlet ? `${this.athlet.firstname[this.lang.slug] || this.athlet.firstname[this.langs[0].slug]} ${this.athlet.lastname[this.lang.slug] || this.athlet.lastname[this.langs[0].slug]}` : "";} 
    get title(): string {return this.athlet ? `${this.athlet.firstname[this.lang.slug] || this.athlet.firstname[this.langs[0].slug]} ${this.athlet.lastname[this.lang.slug] || this.athlet.lastname[this.langs[0].slug]}` : "";} 
    get description(): string {return "";} 
    get id(): number {return parseInt(this.route.snapshot.params["id"]);}

    public async ngOnInit(): Promise<void> {
        this.initScroll();
        this.initPage('catalogue');
        await this.initAthlet(this.id);
        this.route.params.subscribe(async p => this.initSEO()); 
    }

    private async initAthlet(id: number): Promise<void> {
        try {
            this.athlet = await this.athletRepository.loadOne(id);
        } catch (err) {
            err === 404 ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`) : this.appService.notifyError(err);
        }
    }
}