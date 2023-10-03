import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CPopupComponent } from "../../popup.component";
import { CAppService } from "src/app/common/services/app.service";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";

@Component({
    selector: "popup-athlet",
    templateUrl: "popup-athlet.component.html",
    styleUrls: [
        "../../popup.component.scss",
        "../popup-user.component.scss",
    ],
})
export class CPopupAthletComponent extends CPopupComponent implements OnChanges {
    @Input() public id: number;
    public athlet: IAthletOut = null;
    
    constructor(
        protected appService: CAppService,
        protected athletRepository: CAthletRepository,
    ) 
    {
        super(appService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.initAthlet();
    }

    private async initAthlet(): Promise<void> {
        try {
            if (!this.id) return;
            this.athlet = null;
            this.athlet = await this.athletRepository.loadOne(this.id);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
