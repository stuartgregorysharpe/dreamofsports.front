import { Component, Input, ViewEncapsulation } from "@angular/core";
import { CPopupComponent } from "../popup.component";
import { CAppService } from "src/app/common/services/app.service";
import { CComplaintRepository } from "src/app/common/services/repositories/complaint.repository";
import { IComplaintCreate } from "src/app/model/dto/complaint.create.interface";

@Component({
    selector: "popup-complaint",
    templateUrl: "popup-complaint.component.html",
    styleUrls: [
        "../popup.component.scss",
        "popup-complaint.component.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupComplaintComponent extends CPopupComponent {
    @Input() private breaker_id: number;
    public content: string = "";
    public errors: any = {};
    public sending: boolean = false;
    public sent: boolean = false;
    
    constructor(
        protected appService: CAppService,
        protected complaintRepository: CComplaintRepository,
    ) 
    {
        super(appService);
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validate()) return;
            this.sending = true;
            const dto: IComplaintCreate = {breaker_id: this.breaker_id, content: this.content};
            const status = await this.complaintRepository.create(dto);
            this.sending = false;

            if (status === 201) {                
                this.sent = true;
                await this.appService.pause(1000);
                this.content = "";
                this.sent = false;
                this.onClose();
                return;
            }

            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public validate(): boolean {
        let error = false;

        if (!this.content.length) {
            error = true;
            this.errors["content"] = "required";
        } else {
            this.errors["content"] = null;
        }

        return !error;
    }
}
