import { Component } from "@angular/core";
import { CPopupComponent } from "../popup.component";

@Component({
    selector: "popup-onlypaid",
    templateUrl: "popup-onlypaid.component.html",
    styleUrls: [
        "../popup.component.scss",
        "popup-onlypaid.component.scss",
    ],
})
export class CPopupOnlypaidComponent extends CPopupComponent {}
