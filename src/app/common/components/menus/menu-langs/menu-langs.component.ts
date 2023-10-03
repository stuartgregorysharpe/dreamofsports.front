import { Component } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";

@Component({
    selector: "menu-langs",
    templateUrl: "menu-langs.component.html",
})
export class CMenuLangsComponent {
    constructor(private appService: CAppService) {}

    get langs(): ILang[] {return this.appService.langs;}
    get lang(): ILang {return this.appService.lang;}

    /*
    public getLangLinkUrl(lang: ILang): string {
        return this.appService.getLangLink(lang).url;
    }

    public getLangLinkFragment(lang: ILang): string {
        return this.appService.getLangLink(lang).fragment;
    }
    */

    public getLangLink(lang: ILang, mode: "url" | "fragment" | "queryParams"): any {
        return this.appService.getLangLink(lang, mode);
    }
}