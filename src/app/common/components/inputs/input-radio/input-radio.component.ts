import { Component, Input } from "@angular/core";

@Component({
    selector: "input-radio",
    templateUrl: "input-radio.component.html",
    styleUrls: ["input-radio.component.scss"],
})
export class CInputRadioComponent {
    @Input() public active: boolean = false;
    @Input() public title: string = "";
    @Input() public skin: "dark" | "light" = "dark";

    public onTitleClick(event: PointerEvent): void {
        (event.target as HTMLElement).tagName === "A" && event.stopPropagation();
    }
}
