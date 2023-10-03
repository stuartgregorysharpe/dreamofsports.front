import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CArticleRepository } from "src/app/common/services/repositories/article.repository";
import { CArticle } from "src/app/model/entities/article";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "list-articles",
    templateUrl: "list-articles.component.html",
    styleUrls: ["list-articles.component.scss"],
})
export class CListArticles implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    @Input() public catSlug: string = null;
    @Input() public filterDate: Date = undefined;
    @ViewChild("container", {static: false}) private containerRef: ElementRef;
    // data
    public articles: CArticle[] = null;
    public loading: boolean = false;
    public loadingMore: boolean = false;    
    private sortBy: string = "date";
    private sortDir: number = -1;
    private part: number = 0;
    private chunkLength: number = 12;
    private exhausted: boolean = false;  
    private started_at: Date = null;

    constructor(
        private appService: CAppService,
        private articleRepository: CArticleRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}  
    get words(): IWords {return this.appService.words;}
    get isBrowser(): boolean {return this.appService.isBrowser;}
    get container(): HTMLElement {return this.containerRef?.nativeElement;}
    get scrolledToBottom(): boolean {return this.container?.getBoundingClientRect().bottom < this.appService.win.offsetHeight + 300;}
    get canLoadMore(): boolean {return !this.loadingMore && !this.exhausted && this.scrolledToBottom;}    

    public ngOnChanges(changes: SimpleChanges): void {
        this.initArticles();
    }

    public ngOnInit(): void {
        this.onScroll = this.onScroll.bind(this);
    }

    public ngAfterViewInit(): void {
        this.appService.win.addEventListener("scroll", this.onScroll);
    }

    public ngOnDestroy(): void {
        this.appService.win.removeEventListener("scroll", this.onScroll);
    }

    private async initArticles(): Promise<void> {
        try {
            this.loading = true;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной прокрутке при добавлении новых элементов после момента, когда первый кусок загружен.
            const filter = {catSlug: this.catSlug, date_wo_time: this.filterDate};
            const chunk = await this.articleRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);     
            this.articles = chunk.data;     
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.appService.notifyError(err);
        }
    }

    private async onScroll(): Promise<void> {        
        try {	
            if (!this.canLoadMore) return;
            this.loadingMore = true;
            this.part++;            
            const filter = {created_at_less: this.started_at, catSlug: this.catSlug, date_wo_time: this.filterDate}; 
            const chunk = await this.articleRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);  
            this.articles = [...this.articles, ...chunk.data];                                         
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loadingMore = false;		                
		} catch (err) {
			this.loadingMore = false;
			this.appService.notifyError(err);
		}
    }
}