import { Component, ElementRef, ViewChild } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "favorites",
    templateUrl: "favorites.component.html",
    styleUrls: ["../../../../common/styles/users.scss"],
})
export class CFavoritesComponent {
    @ViewChild("container", {static: false}) private containerRef: ElementRef;
    // data
    public athlets: IAthletOut[] = null;
    public loading: boolean = false;
    public loadingMore: boolean = false;    
    protected sortBy: string = "created_at";
    protected sortDir: number = -1;
    protected part: number = 0;
    protected chunkLength: number = 12;
    public exhausted: boolean = false;  
    protected started_at: Date = null;
    // viewer
    public viewerAthletId: number = null;
    public viewerActive: boolean = false;

    constructor(
        protected appService: CAppService,
        protected athletRepository: CAthletRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get container(): HTMLElement {return this.containerRef?.nativeElement;}
    get scrolledToBottom(): boolean {return this.container?.getBoundingClientRect().bottom < this.appService.win.offsetHeight + 300;}
    get canLoadMore(): boolean {return !this.loadingMore && !this.exhausted && this.scrolledToBottom;}  

    public ngOnInit(): void {
        this.onScroll = this.onScroll.bind(this);  
        this.initAthlets();  
    }

    public ngAfterViewInit(): void {
        this.appService.win.addEventListener("scroll", this.onScroll);
    }

    public ngOnDestroy(): void {
        this.appService.win.removeEventListener("scroll", this.onScroll);
    }

    protected async initAthlets(): Promise<void> {
        try {
            this.loading = true;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной загрузке при добавлении новых элементов после момента, когда первый кусок загружен.
            const chunk = await this.athletRepository.loadFavoritesChunk(this.part, this.chunkLength, this.sortBy, this.sortDir);     
            this.athlets = chunk.data;     
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
            const filter: any = {created_at_less: this.started_at};
            const chunk = await this.athletRepository.loadFavoritesChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);     
            this.athlets = [...this.athlets, ...chunk.data];                                         
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loadingMore = false;		                
		} catch (err) {
			this.loadingMore = false;
			this.appService.notifyError(err);
		}
    }

    public async onDelete(i): Promise<void> {
        try {
            if (!window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;
            const id = this.athlets[i].id;
            this.athlets.splice(i, 1);
            await this.athletRepository.favoritesDelete(id);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onView(id: number): void {
        this.viewerAthletId = id;
        this.viewerActive = true;
    }
}