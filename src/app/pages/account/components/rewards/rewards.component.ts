import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { CReward } from "src/app/model/entities/reward";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "rewards",
    templateUrl: "rewards.component.html",
    styleUrls: ["rewards.component.scss"],
})
export class CRewardsComponent {
    @Input() public rewards: CReward[];
    @Input() public errors: string[] = [];   
    @Input() public currentLang: ILang;

    constructor(private appService: CAppService) {}

    get langs(): ILang[] {return this.appService.langs;}
    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get exhausted(): boolean {return this.rewards.length >= parseInt(this.appService.settings[`limit-rewards`]);} 

    public onAdd(): void {
        this.rewards.push(new CReward().init(this.langs));
    }

    public onDelete(i: number): void {
        this.rewards.splice(i, 1);
    }
}