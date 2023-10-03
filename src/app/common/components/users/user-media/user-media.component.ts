import { Component, EventEmitter, Input, Output } from "@angular/core";
import { cfg } from "src/app/app.config";

type TFilesType = "images" | "videos";

interface IFilesElement {
    url: string;    
}

@Component({
    selector: "user-media",
    templateUrl: "user-media.component.html",
    styleUrls: ["user-media.component.scss"],    
})
export class CUserMediaComponent {
    @Input() public data: IFilesElement[];
    @Input() public type: TFilesType;
    @Output() private viewItem: EventEmitter<string> = new EventEmitter();
    
    get supabaseUrl(): string {return cfg.supabaseUrl;}

    public onClick(item: IFilesElement): void {
        this.viewItem.emit(item.url);
    }
}