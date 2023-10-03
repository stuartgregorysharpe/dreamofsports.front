import { Component, DoCheck, KeyValueDiffer, KeyValueDiffers, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAthletsFilterService } from "src/app/common/services/athlets-filter.service";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { CAthletsListComponent } from "./athlets-list.component";

@Component({
    selector: "athlets-filtered",
    templateUrl: "athlets-list.component.html",
    styleUrls: ["../../../../common/styles/users.scss"],
})
export class CAthletsFilteredComponent extends CAthletsListComponent implements OnInit, DoCheck {
    private filterDiffer: KeyValueDiffer<string, any> = null;

    constructor(
        protected appService: CAppService,
        protected filterService: CAthletsFilterService,
        protected athletRepository: CAthletRepository,
        protected differs: KeyValueDiffers,
    ) 
    {
        super(appService, athletRepository);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.filterDiffer = this.differs.find(this.filterService.filter).create();
    }

    public ngDoCheck(): void {
        const changes = this.filterDiffer.diff(this.filterService.filter);
        changes && this.initAthlets();
    }

    protected async initAthlets(): Promise<void> {
        try {
            this.loading = true;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной загрузке при добавлении новых элементов после момента, когда первый кусок загружен.
            const filter = {...this.filterService.filter};                        
            const chunk = await this.athletRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);     
            this.athlets = chunk.data;     
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.appService.notifyError(err);
        }
    }

    protected async onScroll(): Promise<void> {
        try {	
            if (!this.canLoadMore) return;
            this.loadingMore = true;
            this.part++;            
            const filter: any = {...this.filterService.filter};
            filter.created_at_less = this.started_at;            
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