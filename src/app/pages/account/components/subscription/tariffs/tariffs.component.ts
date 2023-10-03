import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Timeout } from "src/app/common/decorators/timeout";
import { CAppService } from "src/app/common/services/app.service";
import { CTariffRepository } from "src/app/common/services/repositories/tariff.repository";
import { ILang } from "src/app/model/entities/lang.interface";
import { ITariff } from "src/app/model/entities/tariff.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "tariffs",
    templateUrl: "tariffs.component.html",
    styleUrls: ["tariffs.component.scss"],
})
export class CTariffsComponent implements OnInit, OnChanges {
    @Input() public paysystemName: string;
    @Input() public value: ITariff = null;
    @Output() private valueChange: EventEmitter<ITariff> = new EventEmitter();
    public tariffs: ITariff[] = [];
    
    constructor(
        private tariffRepository: CTariffRepository,
        private appService: CAppService,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.initTariffs();        
    }

    @Timeout(1)
    public ngOnChanges(): void {
        // текущий тариф несовместим с nowpayments
        this.paysystemName === "nowpayments" && !this.value?.np_compatible && this.valueChange.emit(null);
    }

    private async initTariffs(): Promise<void> {
        try {
            this.tariffs = await this.tariffRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onSelect(t: ITariff): void {
        this.valueChange.emit(t);
    }
}