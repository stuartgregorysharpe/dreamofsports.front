import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "input-search",
    templateUrl: "input-search.component.html",
    styleUrls: ["input-search.component.scss"],
})
export class CInputSearchComponent {
    @Input() public compact: boolean = false;
    @Output() private submitted: EventEmitter<void> = new EventEmitter();
    public search: string = "";

    constructor(
        private appService: CAppService,
        private router: Router,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    public onSubmit(): void {
        if (this.search.length < 3) return;
        this.router.navigateByUrl(`/${this.lang.slug}/catalogue/search#${this.search}`);
        this.search = "";
        this.submitted.emit();
    }
}
