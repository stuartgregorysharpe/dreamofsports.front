import { Component, ViewEncapsulation } from "@angular/core";
import { CAppService } from "../../services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "the-footer",
    templateUrl: "footer.component.html",
    styleUrls: ["footer.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CFooterComponent {
    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get url(): string[] {return this.appService.url;}
}