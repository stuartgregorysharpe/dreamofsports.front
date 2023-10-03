import { Component, Input } from "@angular/core";

@Component({
    selector: "input-checkbox",
    templateUrl: "input-checkbox.component.html",
    styleUrls: ["input-checkbox.component.scss"],
})
export class CInputCheckboxComponent {
    @Input() public active: boolean = false;
    @Input() public title: string = "";
    @Input() public skin: "dark" | "light" = "dark";
    @Input() public error: boolean = false;

    public onTitleClick(event: PointerEvent): void {
        (event.target as HTMLElement).tagName === "A" && event.stopPropagation();
    }
}
