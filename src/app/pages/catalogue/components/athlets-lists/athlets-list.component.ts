import { AfterViewInit, Directive, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Directive()
export abstract class CAthletsListComponent implements OnInit, AfterViewInit, OnDestroy {
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
    }

    public ngAfterViewInit(): void {
        this.appService.win.addEventListener("scroll", this.onScroll);
    }

    public ngOnDestroy(): void {
        this.appService.win.removeEventListener("scroll", this.onScroll);
    }

    protected abstract onScroll(): Promise<void>;
}