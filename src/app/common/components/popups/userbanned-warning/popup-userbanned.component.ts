import { Component } from "@angular/core";
import { CPopupComponent } from "../popup.component";
import { CAppService } from "src/app/common/services/app.service";
import { CChatRepository } from "src/app/common/services/repositories/chat.repository";
import { Router } from "@angular/router";

@Component({
    selector: "popup-userbanned",
    templateUrl: "popup-userbanned.component.html",
    styleUrls: [
        "../popup.component.scss",
        "popup-userbanned.component.scss",
    ],
})
export class CPopupUserbannedComponent extends CPopupComponent {
    public unbanning: boolean = false;

    constructor(
        protected appService: CAppService,
        protected chatRepository: CChatRepository,
        protected router: Router,
    ) 
    {
        super(appService);
    }

    public async unBan(): Promise<void> {
        try {
            this.unbanning = true;
            await this.chatRepository.unban(this.appService.popupUserbannedId);
            this.unbanning = false;            
            this.onConnect();
        } catch (err) {
            this.onClose();
            this.unbanning = false;
            this.appService.notifyError(err);
        }
    }

    public async onConnect(): Promise<void> {
        try {
            const chat_id = await this.chatRepository.create(this.appService.popupUserbannedId);
            this.router.navigateByUrl(`/${this.lang.slug}/account/messenger/${chat_id}`);
            this.onClose();
        } catch (err) {
            this.onClose();
            this.onConnectFailed(err); 
        }
    }

    private onConnectFailed(err: any): void {
        err === 401 && (this.appService.popupOnlypaidActive = true);
        err === 4011 && (this.appService.popupYoubannedActive = true);
        err === 4012 && (this.appService.popupUserbannedActive = true);
    }
}
