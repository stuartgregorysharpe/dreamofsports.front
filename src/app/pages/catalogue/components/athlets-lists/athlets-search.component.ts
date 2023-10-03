import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { CAthletsListComponent } from "./athlets-list.component";

@Component({
    selector: "athlets-search",
    templateUrl: "athlets-list.component.html",
    styleUrls: ["../../../../common/styles/users.scss"],
})
export class CAthletsSearchComponent extends CAthletsListComponent implements OnInit, OnChanges {
    @Input() private query: string;    
    
    public ngOnChanges(changes: SimpleChanges): void {
        this.initAthlets();
    }

    protected async initAthlets(): Promise<void> {
        try {
            this.loading = true;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной загрузке при добавлении новых элементов после момента, когда первый кусок загружен.
            const filter = {search: this.query};                        
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
            const filter = {search: this.query, created_at_less: this.started_at};                     
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
