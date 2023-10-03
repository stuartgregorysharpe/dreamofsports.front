import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CAppService } from "src/app/common/services/app.service";
import { CArticleCatRepository } from "src/app/common/services/repositories/article.cat.repository";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { IArticleCat } from "src/app/model/entities/article.cat.interface";
import { CSimplePage } from "src/app/pages/simple.page";
import { CArticlesService } from "../../services/articles.service";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
    selector: "articles-page",
    templateUrl: "articles.page.html",
    styleUrls: ["articles.page.scss"],
})
export class CArticlesPage extends CSimplePage {
    public cat: IArticleCat = null;

    constructor(
        protected appService: CAppService,
        protected articlesService: CArticlesService,
        protected pageRepository: CPageRepository,
        protected articleCatRepository: CArticleCatRepository,
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
    get filterDate(): Date {return this.articlesService.filterDate;}
    set filterDate(v: Date) {this.articlesService.filterDate = v;}

    public async ngOnInit(): Promise<void> {
        this.initScroll(); 
        await this.initPage('articles');        
        this.route.params.subscribe(async p => {
            await this.initCat(p['cat']);
            this.initSEO();
        });
    }

    private async initCat(slug: string): Promise<void> {
        try {
            if (!slug) {
                this.cat = null;                
            } else if (slug !== this.cat?.slug) {
                this.cat = await this.articleCatRepository.loadOne(slug);
            }
        } catch (err) {
            err === 404 ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`) : this.appService.notifyError(err);
        }
    }
}