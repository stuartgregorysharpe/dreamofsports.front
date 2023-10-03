import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { cfg } from "src/app/app.config";
import { IFilesElement, TFilesType } from "../files.model";

@Component({
    selector: "[files-item]",
    templateUrl: "files-item.component.html",
})
export class CFilesItemComponent implements OnChanges {
    @Input() public item: IFilesElement;
    @Input() public type: TFilesType;
    @Input() public folder: string;
    @Input() public supabase: boolean;
    public url: string = "";

    public ngOnChanges(changes: SimpleChanges): void {
        this.buildUrl();
    }

    private buildUrl(): void {        
        if (typeof(this.item.url) === "string") {
            const root = this.supabase ? cfg.supabaseUrl : "";
            this.url = `${root}/${this.type}/${this.folder}/${this.item.url}?t=${new Date().getTime()}`;
            return;
        }
        
        this.url = URL.createObjectURL(this.item.url);            
    }
}
