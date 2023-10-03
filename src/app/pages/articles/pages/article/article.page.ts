import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { CAppService } from "src/app/common/services/app.service";
import { CArticleRepository } from "src/app/common/services/repositories/article.repository";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { CArticle } from "src/app/model/entities/article";
import { IArticleCat } from "src/app/model/entities/article.cat.interface";
import { CSimplePage } from "src/app/pages/simple.page";

@Component({
    selector: "article-page",
    templateUrl: "article.page.html",
    styleUrls: ["article.page.scss"],
})
export class CArticlePage extends CSimplePage {
    public article: CArticle = null;

    constructor(
        protected appService: CAppService,
        protected pageRepository: CPageRepository,
        protected articleRepository: CArticleRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService
    ) 
    {
        super(appService, pageRepository, route, router, deviceDetector);
    }

    get content(): string {return this.article?.content[this.lang.slug];}
    get img(): string {return this.article?.img_s;}
    get h1(): string {return this.article?.h1[this.lang.slug] || this.article?.name[this.lang.slug] || "&nbsp;";} 
    get title(): string {return this.article?.title[this.lang.slug] || this.article?.name[this.lang.slug];} 
    get description(): string {return this.article?.description[this.lang.slug];} 
    get slug(): string {return this.route.snapshot.params["article"];}
    get cat(): IArticleCat {return this.article?.cat;}
    get isBrowser(): boolean {return this.appService.isBrowser;}

    public async ngOnInit(): Promise<void> {
        this.initPage('articles');
        this.route.params.subscribe(async p => {
            if (p["article"] !== this.article?.slug) {
                this.initScroll();
                await this.initArticle(p["article"]);  
            }
            this.initSEO();
        }); 
    }

    private async initArticle(slug: string): Promise<void> {
        try {
            this.article = await this.articleRepository.loadOne(slug);
        } catch (err) {
            err === 404 ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`) : this.appService.notifyError(err);
        }
    }
}