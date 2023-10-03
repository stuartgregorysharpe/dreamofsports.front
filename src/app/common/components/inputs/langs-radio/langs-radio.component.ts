import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "langs-radio",
    templateUrl: "langs-radio.component.html",
    styleUrls: ["langs-radio.component.scss"],
})
export class CLangsRadioComponent {
    @Input() public value: ILang;
    @Output() private valueChange: EventEmitter<ILang> = new EventEmitter();
    @Input() public skin: "dark" | "light" = "dark";

    constructor(private appService: CAppService) {}

    get langs(): ILang[] {return this.appService.langs;}
    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    public onSelect(lang: ILang): void {
        this.valueChange.emit(lang);
    }
}