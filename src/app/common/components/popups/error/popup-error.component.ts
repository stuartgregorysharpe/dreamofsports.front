import { Component } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";

@Component({
    selector: "popup-error",
    templateUrl: "popup-error.component.html",
    styleUrls: ["popup-error.component.scss"],
})
export class CPopupErrorComponent {
    constructor(private appService: CAppService) {}

    get active(): boolean {return this.appService.notifyErrorActive;}
    set active(v: boolean) {this.appService.notifyErrorActive = v;}
    get txt(): string {return this.appService.notifyErrorMsg;}

    public onClose(): void {
        this.active = false;
    }

    public onReload(): void {
        document.location = document.location;
    }
}
