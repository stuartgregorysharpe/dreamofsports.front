import { Directive } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CAppService } from "../common/services/app.service";
import { CPageRepository } from "../common/services/repositories/page.repository";
import { ILang } from "../model/entities/lang.interface";
import { IPage } from "../model/entities/page.interface";
import { IWords } from "../model/entities/words.interface";
import { DeviceDetectorService } from 'ngx-device-detector';

@Directive()
export abstract class CSimplePage {
    constructor(
        protected appService: CAppService,
        protected pageRepository: CPageRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService
    ) {}

    get words(): IWords {return this.appService.words;}      
    get lang(): ILang {return this.appService.lang;}  
    get langs(): ILang[] {return this.appService.langs;}  
    get page(): IPage {return this.appService.page;}
    set page(v: IPage) {this.appService.page = v;}
    get content(): string {return this.page?.content[this.lang.slug];}
    get img(): string {return this.page?.img;}
    get h1(): string {return this.page?.h1[this.lang.slug] || this.page?.name[this.lang.slug] || "&nbsp;";} 
    get title(): string {return this.page?.title[this.lang.slug] || this.page?.name[this.lang.slug];} 
    get description(): string {return this.page?.description[this.lang.slug];} 

    protected async initPage(slug: string): Promise<void> {
        try {
            this.page = await this.pageRepository.loadOne(slug);
        } catch (err) {
            err === 404 ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`) : this.appService.notifyError(err);
        }
    }

    protected initSEO(): void {
        this.appService.setTitle(this.title);   
        this.appService.setMeta("name", "description", this.description);
    }

    protected initScroll(): void {
        this.appService.isBrowser && this.appService.win.scrollTop && setTimeout(() => this.appService.win.scrollTo(0, 0), 1)
    }
}
