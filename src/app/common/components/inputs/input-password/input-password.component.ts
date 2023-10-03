import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";

@Component({
    selector: "input-password",
    templateUrl: "input-password.component.html",
    styleUrls: ["input-password.component.scss"],
})
export class CInputPasswordComponent implements OnChanges {
    @Input() private value: string;
    @Input() public error: boolean = false;
    @Input() public placeholder: string = "";
    @Input() public skin: "dark" | "light" = "dark";
    @Output() private valueChange: EventEmitter<string> = new EventEmitter();
    public currentValue: string = "";
    public visible: boolean = false;

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang;}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["value"] !== undefined) {
            this.currentValue = this.value;
        }
    }    

    public onChange(): void {
        this.valueChange.emit(this.currentValue);
    }
}
