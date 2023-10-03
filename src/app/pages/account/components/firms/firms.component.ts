import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CFirmRepository } from "src/app/common/services/repositories/firm.repository";
import { IFirmOut } from "src/app/model/entities/firm.out.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "firms",
    templateUrl: "firms.component.html",
    styleUrls: [
        "../../../../common/styles/users.scss",
        "firms.component.scss",
    ],
})
export class CFirmsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("container", {static: false}) private containerRef: ElementRef;
    // data
    public firms: IFirmOut[] = null;
    public search: string = "";
    public loading: boolean = false;
    public loadingMore: boolean = false;    
    protected sortBy: string = "created_at";
    protected sortDir: number = -1;
    protected part: number = 0;
    protected chunkLength: number = 20;
    public exhausted: boolean = false;  
    protected started_at: Date = null;
    // viewer
    public viewerFirmId: number = null;
    public viewerActive: boolean = false;

    constructor(
        protected appService: CAppService,
        protected firmRepository: CFirmRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get container(): HTMLElement {return this.containerRef?.nativeElement;}
    get scrolledToBottom(): boolean {return this.container?.getBoundingClientRect().bottom < this.appService.win.offsetHeight + 300;}
    get canLoadMore(): boolean {return !this.loadingMore && !this.exhausted && this.scrolledToBottom;}  

    public ngOnInit(): void {
        this.onScroll = this.onScroll.bind(this);    
        this.initFirms();
    }

    public ngAfterViewInit(): void {
        this.appService.win.addEventListener("scroll", this.onScroll);
    }

    public ngOnDestroy(): void {
        this.appService.win.removeEventListener("scroll", this.onScroll);
    }
    
    protected async initFirms(): Promise<void> {
        try {
            this.loading = true;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной загрузке при добавлении новых элементов после момента, когда первый кусок загружен.
            const filter = {search: this.search};                        
            const chunk = await this.firmRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);     
            this.firms = chunk.data;     
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
            const filter = {search: this.search, created_at_less: this.started_at};                     
            const chunk = await this.firmRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);     
            this.firms = [...this.firms, ...chunk.data];                                         
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loadingMore = false;		                
		} catch (err) {
			this.loadingMore = false;
			this.appService.notifyError(err);
		}
    }

    public onView(id: number): void {
        this.viewerFirmId = id;
        this.viewerActive = true;
    }
}
