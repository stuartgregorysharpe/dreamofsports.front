import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "athlets-top",
    templateUrl: "athlets-top.component.html",
    styleUrls: ["../../../../common/styles/users.scss"],
})
export class CAthletsTopComponent implements OnInit {
    public athlets: IAthletOut[] = null;
    public loading: boolean = false;
    public loadingMore: boolean = false;    
    private sortBy: string = "payed_at";
    private sortDir: number = -1;
    private part: number = 0;
    private chunkLength: number = 5;
    public exhausted: boolean = false;  
    private started_at: Date = null;

    constructor(
        private appService: CAppService,
        private athletRepository: CAthletRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.initAthlets();
    }

    private async initAthlets(): Promise<void> {
        try {
            this.loading = true;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной загрузке при добавлении новых элементов после момента, когда первый кусок загружен.
            const filter = {top: true};
            const chunk = await this.athletRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);     
            this.athlets = chunk.data;     
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.appService.notifyError(err);
        }
    }

    public async onLoadMore(): Promise<void> {
        try {		
            if (this.exhausted) return;
            this.loadingMore = true;
            this.part++;            
            const filter = {payed_at_less: this.started_at, top: true}; 
            const chunk = await this.athletRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);  
            this.athlets = [...this.athlets, ...chunk.data];                                         
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loadingMore = false;		                
		} catch (err) {
			this.loadingMore = false;
			this.appService.notifyError(err);
		}
    }
}