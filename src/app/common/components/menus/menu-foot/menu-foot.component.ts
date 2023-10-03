import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { IPage } from "src/app/model/entities/page.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { CAppService } from "src/app/common/services/app.service";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";

@Component({
    selector: "menu-foot",
    templateUrl: "menu-foot.component.html",
})
export class CMenuFootComponent implements OnInit {
    public pages: IPage[] = [];
    
    constructor(
        private appService: CAppService,
        private pageRepository: CPageRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get url(): string[] {return this.appService.url;}

    public ngOnInit(): void {
        this.initPages();
    }

    private async initPages(): Promise<void> {
        try {
            this.pages = await this.pageRepository.loadMenuFoot();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public pageUrl(page: IPage): string {
        return page.slug !== "home" ? `/${this.lang.slug}/${page.slug}` : `/${this.lang.slug}`;
    }

    public isActive(page: IPage): boolean {
        return page.slug !== "home" ? page.slug === this.url[2] : !this.url[2];
    }
}