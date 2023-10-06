import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAthletsFilterService } from "src/app/common/services/athlets-filter.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { CAuthService } from "../../../services/auth.service";

@Component({
    selector: "menu-mobile",
    templateUrl: "menu-mobile.component.html",
    styleUrls: ["menu-mobile.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CMenuMobileComponent {
    @Input() public active: boolean;
    @Output() private activeChange: EventEmitter<boolean> = new EventEmitter();
    
    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private athletsFilterService: CAthletsFilterService,
    ) {}
 
    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get url(): string[] {return this.appService.url;}
    get catalogueLink(): string {
        const slug = this.athletsFilterService.filter.cat_slug;
        return slug ? `/${this.lang.slug}/catalogue/${slug}` : `/${this.lang.slug}/catalogue`;
    }   

    public close(): void {
        this.activeChange.emit(false);
    }  
}