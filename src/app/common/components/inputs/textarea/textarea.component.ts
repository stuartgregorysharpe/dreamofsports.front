import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang, TDir } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "the-textarea",
    templateUrl: "textarea.component.html",
    styleUrls: ["textarea.component.scss"],
})
export class CTextareaComponent implements OnChanges {
    @Input() private value: string;
    @Input() public error: string = null;
    @Input() public placeholder: string = "";
    @Input() public maxlength: number = 255;
    @Input() public dir: TDir = null;
    @Output() private valueChange: EventEmitter<string> = new EventEmitter();
    public currentValue: string = "";

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang;}
    get currentDir(): TDir {return this.dir || this.lang.dir;}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["value"] !== undefined) {
            this.currentValue = this.value;
        }
    }    

    public onChange(): void {
        this.valueChange.emit(this.currentValue);
    }
}
