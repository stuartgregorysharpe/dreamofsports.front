import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { IPage } from "src/app/model/entities/page.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { CAppService } from "src/app/common/services/app.service";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { CAuthService } from "../../../services/auth.service";

@Component({
    selector: "menu-main",
    templateUrl: "menu-main.component.html",
})
export class CMenuMainComponent {
    @Output() private clicked: EventEmitter<void> = new EventEmitter(); 
    
    constructor(
        private appService: CAppService,
        private authService: CAuthService
        ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get url(): string[] {return this.appService.url;}    
    get pages(): IPage[] {return this.appService.mainMenu;}


    public pageUrl(page: IPage): string {
        return page.slug !== "home" ? `/${this.lang.slug}/${page.slug}` : `/${this.lang.slug}`;
    }

    public isActive(page: IPage): boolean {
        return page.slug !== "home" ? page.slug === this.url[2] : !this.url[2];
    }

    public onClick(): void {
        this.clicked.emit();
    }
    get authorized(): boolean {
        return !!this.authService.authData;
    } 
}