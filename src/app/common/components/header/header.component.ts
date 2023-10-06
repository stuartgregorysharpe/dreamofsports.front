import { Component, ViewEncapsulation } from "@angular/core";
import { CAppService } from "../../services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { CAthletsFilterService } from "../../services/athlets-filter.service";
import { CAuthService } from "../../services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { cfg } from "src/app/app.config";

@Component({
    selector: "the-header",
    templateUrl: "header.component.html",
    styleUrls: ["header.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CHeaderComponent {
    public mmActive: boolean = false;

    constructor(
        private appService: CAppService,
        private athletsFilterService: CAthletsFilterService,
        private authService: CAuthService,
        private translate: TranslateService
    ) { }

    get lang(): ILang { return this.appService.lang; }
    get words(): IWords { return this.appService.words; }
    get url(): string[] { return this.appService.url; }
    get catalogueLink(): string {
        const slug = this.athletsFilterService.filter.cat_slug;
        return slug ? `/${this.lang.slug}/catalogue/${slug}` : `/${this.lang.slug}/catalogue`;
    }
    get authorized(): boolean {
        return !!this.authService.authData;
    }
    get userImg(): string {
        if (!this.authService.authData) return "/imgages/default-avatar.jpg";

        if (this.authService.user?.type === "athlet") {
            return this.authService.user?.athlet.img ? `${cfg.supabaseUrl}/images/users/${this.authService.user?.athlet.img_s}` : '/images/default-avatar.jpg';
        } else {
            return this.authService.user?.firm.img ? `${cfg.supabaseUrl}/images/users/${this.authService.user?.firm.img_s}` : '/images/default-avatar.jpg';
        }
    }
    get userName(): string {
        if (!this.authService.user) return "/imgages/default-avatar.jpg";
        if (this.authService.user.type === "athlet") {
            const translation = this.authService.user.athlet.translations.find((t) => t.lang_id === this.lang.id);
            return `${translation?.firstname} ${translation?.lastname}`
        } else {
            const translation = this.authService.user.firm.translations.find((t) => t.lang_id === this.lang.id);
            return translation?.name;
        }
    }
    
    public async onRegister(): Promise<void> {
        await this.appService.pause(500);
        this.appService.popupRegisterActive = true;
    }
}
