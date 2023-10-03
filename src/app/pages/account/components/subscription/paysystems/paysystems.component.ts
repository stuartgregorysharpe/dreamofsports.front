import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CPaysystemRepository } from "src/app/common/services/repositories/paysystem.repository";
import { ILang } from "src/app/model/entities/lang.interface";
import { IPaysystem } from "src/app/model/entities/paysystem.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "paysystems",
    templateUrl: "paysystems.component.html",
    styleUrls: ["paysystems.component.scss"],
})
export class CPaysystemsComponent implements OnInit {
    @Input() public value: IPaysystem = null;
    @Output() private valueChange: EventEmitter<IPaysystem> = new EventEmitter();
    public paysystems: IPaysystem[] = [];

    constructor(
        protected appService: CAppService,
        protected paysystemRepository: CPaysystemRepository,
    ) {}

    get words(): IWords {return this.appService.words;}      
    get lang(): ILang {return this.appService.lang;}  

    public ngOnInit(): void {
        this.initPaysystems();
    }

    private async initPaysystems(): Promise<void> {
        try {
            this.paysystems = await this.paysystemRepository.loadAll();
            this.paysystems.length && this.valueChange.emit(this.paysystems[0]);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onSelect(p: IPaysystem): void {
        this.valueChange.emit(p);
    }
}