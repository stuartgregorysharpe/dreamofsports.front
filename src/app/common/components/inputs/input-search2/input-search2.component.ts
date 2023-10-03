import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "input-search2",
    templateUrl: "input-search2.component.html",
    styleUrls: ["input-search2.component.scss"],
})
export class CInputSearch2Component {
    @Input() public value: string;
    @Input() public placeholder: string = "";
    @Input() skin: "light" | "dark" = "dark";
    @Output() private valueChange: EventEmitter<string> = new EventEmitter();
    public currentValue: string = "";

    public onSubmit(): void {        
        this.valueChange.emit(this.currentValue);
    }

    public onReset(): void {
        this.currentValue = "";
        this.valueChange.emit(this.currentValue);
    }
}
