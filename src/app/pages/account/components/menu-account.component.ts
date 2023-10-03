import { Directive } from "@angular/core";
import { Router } from "@angular/router";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words.interface";

@Directive()
export abstract class CMenuAccountComponent {
    public abstract userImg: string;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private router: Router,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get url(): string[] {return this.appService.url;}
    get user(): CUser {return this.authService.user;}

    public onLogout(): void {
        window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug]) && this.router.navigateByUrl(`/${this.lang.slug}/auth/logout`);
    }
}