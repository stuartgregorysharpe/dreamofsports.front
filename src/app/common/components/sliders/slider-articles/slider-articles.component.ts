import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CArticleRepository } from "src/app/common/services/repositories/article.repository";
import { CSlider } from "../slider.component";
import { CArticle } from "src/app/model/entities/article";

// маленький незацикленный слайдер по 3 штуки на экран
@Component({
    selector: "slider-articles",
    templateUrl: "slider-articles.component.html",
    styleUrls: ["slider-articles.component.scss"],
})
export class CSliderArticlesComponent extends CSlider implements OnChanges  {
    @Input() protected excludeSlug: string = null;
    @Input() protected in_gal: boolean = undefined;
    @Input() protected catSlug: number = undefined;
    // data
    public dataItems: CArticle[] = [];
    protected sortBy: string = "date";
    protected sortDir: number = -1;
    protected chunkLength: number = 10;

    constructor(
        protected appService: CAppService,
        protected articleRepository: CArticleRepository,
    ) 
    {
        super(appService);
    }
    
    get filter(): any {return {excludeSlug: this.excludeSlug, in_gal: this.in_gal, catSlug: this.catSlug};}

    /////////////////
    // init
    /////////////////

    public ngOnChanges(changes: SimpleChanges): void {
        this.reset();
        this.initData();
    }

    protected async initData(): Promise<void> {
        try {
            const chunk = await this.articleRepository.loadChunk(0, this.chunkLength, this.sortBy, this.sortDir, this.filter);     
            this.dataItems = chunk.data;     
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    protected initLayout(): void {
        if (!this.isBrowser) return;
        if (window.innerWidth >= 1000) {
            this.itemMargin = 30;
            this.itemWidth = (this.viewport.offsetWidth - 2 * this.itemMargin) / 3;
            this.framesInViewport = 3;
        } else if (window.innerWidth >= 640) {
            this.itemMargin = 15;
            this.itemWidth = (this.viewport.offsetWidth - this.itemMargin) / 2;
            this.framesInViewport = 2;
        } else {
            this.itemMargin = 15;
            this.itemWidth = this.viewport.offsetWidth;
            this.framesInViewport = 1;
        }
    }
}
