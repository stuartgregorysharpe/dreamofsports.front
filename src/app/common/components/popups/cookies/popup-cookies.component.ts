import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CCookieService } from "src/app/common/services/cookie.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "popup-cookies",
    templateUrl: "popup-cookies.component.html",
    styleUrls: ["popup-cookies.component.scss"],
})
export class CPopupCookiesComponent implements OnInit {
    public active: boolean = false;

    constructor(
        private appService: CAppService,
        private cookieService: CCookieService,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        if (this.appService.isBrowser && !this.cookieService.getItem("cookie-agree")) {
            this.active = true;
        }
    }

    public onClose(): void {
        this.active = false;
        this.cookieService.setItem("cookie-agree", "true");
    }
}