import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CCatRepository } from "src/app/common/services/repositories/cat.repository";
import { ICatSimple } from "src/app/model/entities/cat.simple.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { IKeyValue } from "src/app/model/keyvalue.interface";

@Component({
    selector: "menu-foot-cats",
    templateUrl: "menu-foot-cats.component.html",
})
export class CMenuFootCatsComponent implements OnInit {
    public cats: IKeyValue<ICatSimple[]> = {};

    constructor(
        private appService: CAppService,
        private catRepository: CCatRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get url(): string[] {return this.appService.url;}

    public ngOnInit(): void {
        this.initCats();
    }

    private async initCats(): Promise<void> {
        try {
            this.cats = await this.catRepository.loadMenuFoot();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public isActive(cat: ICatSimple): boolean {
        return cat.slug === this.url[3];
    }
}