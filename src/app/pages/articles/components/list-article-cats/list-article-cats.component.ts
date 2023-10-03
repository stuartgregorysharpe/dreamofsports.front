import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CArticleCatRepository } from "src/app/common/services/repositories/article.cat.repository";
import { IArticleCat } from "src/app/model/entities/article.cat.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "list-article-cats",
    templateUrl: "list-article-cats.component.html",
    styleUrls: ["list-article-cats.component.scss"],
})
export class CListArticleCats implements OnInit {
    public cats: IArticleCat[] = [];

    constructor(
        private appService: CAppService,
        private articleCatRepository: CArticleCatRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}  
    get words(): IWords {return this.appService.words;}
    get url(): string[] {return this.appService.url;}

    public ngOnInit(): void {
        this.initCats();
    }

    private async initCats(): Promise<void> {
        try {
            this.cats = await this.articleCatRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
