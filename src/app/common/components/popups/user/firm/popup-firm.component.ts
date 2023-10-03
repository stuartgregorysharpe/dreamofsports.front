import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CPopupComponent } from "../../popup.component";
import { CAppService } from "src/app/common/services/app.service";
import { CFirmRepository } from "src/app/common/services/repositories/firm.repository";
import { IFirmOut } from "src/app/model/entities/firm.out.interface";

@Component({
    selector: "popup-firm",
    templateUrl: "popup-firm.component.html",
    styleUrls: [
        "../../popup.component.scss",
        "../popup-user.component.scss",
    ],
})
export class CPopupFirmComponent extends CPopupComponent implements OnChanges {
    @Input() public id: number;
    public firm: IFirmOut = null;
    
    constructor(
        protected appService: CAppService,
        protected firmRepository: CFirmRepository,
    ) 
    {
        super(appService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.initFirm();
    }

    private async initFirm(): Promise<void> {
        try {
            if (!this.id) return;
            this.firm = null;
            this.firm = await this.firmRepository.loadOne(this.id);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
