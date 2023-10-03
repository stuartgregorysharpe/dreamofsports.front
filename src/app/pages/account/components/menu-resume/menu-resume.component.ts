import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IPageWords } from "src/app/model/entities/page.interface";

@Component({
    selector: "menu-resume",
    templateUrl: "menu-resume.component.html",
    styleUrls: ["menu-resume.component.scss"],
})
export class CMenuResumeComponent {
    @Input() public layout: 3 | 4 = 4;
    @Input() public words: IPageWords;
    @Input() public chapter: string;
    @Input() public chapters: string[];
    @Input() public errors: any = {};
    @Output() private chapterChange: EventEmitter<string> = new EventEmitter();

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang;}

    public onSelect(chapter: string): void {
        this.chapterChange.emit(chapter);
    }
}