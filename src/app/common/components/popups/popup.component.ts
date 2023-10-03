import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { CAppService } from "../../services/app.service";

@Directive()
export abstract class CPopupComponent implements OnInit {
    @Input() public active: boolean; // удобнее сделать через внешний параметр, чтобы повесить OnChanges
    @Output() protected activeChange: EventEmitter<boolean> = new EventEmitter();
    public unique: number = 0;

    constructor(protected appService: CAppService) {}

    get words(): IWords {return this.appService.words;}      
    get lang(): ILang {return this.appService.lang;}  

    public ngOnInit(): void {
        this.unique = this.appService.rndId();
    }

    public onClose(): void {
        this.activeChange.emit(false);
    }

    public onClick(event: PointerEvent): void {        
        if (this.active && !this.appService.pathHasIds(event.composedPath() as HTMLElement[], [`popup-${this.unique}`])) {
            this.onClose();
        }
    }  
}