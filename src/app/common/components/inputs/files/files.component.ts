import { Component, Input, ViewEncapsulation } from "@angular/core";
import { cfg } from "src/app/app.config";
import { CUserImage } from "src/app/model/entities/user.image";
import { CUserVideo } from "src/app/model/entities/user.video";
import { CUserOther } from "src/app/model/entities/user.other";
import { IFilesElement, TFilesType } from "./files.model";
import { CAppService } from "src/app/common/services/app.service";
import { CUploadService } from "src/app/common/services/upload.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { ISettings } from "src/app/model/entities/settings.interface";

@Component({
    selector: "files",
    templateUrl: "files.component.html",
    styleUrls: ["files.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CFilesComponent {
    @Input() public data: IFilesElement[];
    @Input() public type: TFilesType;
    @Input() public folder: string;
    @Input() public supabase: boolean = false;
    public viewerImg: string = null;
    public viewerActive: boolean = false;
    public error: string = null;

    constructor(
        private appService: CAppService,
        private uploadService: CUploadService,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get settings(): ISettings {return this.appService.settings;}
    get exhausted(): boolean {return this.data.length >= parseInt(this.settings[`limit-${this.type}`]);}

    public onDownload(i: number): void {
        const element = document.createElement("a");
        const url = typeof(this.data[i].url) === "string" ?
            `/proxy/download?fileurl=${this.supabase ? cfg.supabaseUrl : ""}/${this.type}/${this.folder}/${this.data[i].url}` :
            URL.createObjectURL(this.data[i].url as File);
        element.setAttribute("href", url);
        element.setAttribute("target", "_blank"); 
        element.setAttribute("download", this.data[i].name);
        element.click();
    }

    public onView(i: number): void {        
        this.viewerImg = typeof(this.data[i].url) === "string" ?
            `${this.supabase ? cfg.supabaseUrl : ""}/${this.type}/${this.folder}/${this.data[i].url}` :
            URL.createObjectURL(this.data[i].url as File);
        this.viewerActive = true;
    }

    public onDelete(i: number): void {
        this.data.splice(i, 1);        
    }

    public onSelect(event: MouseEvent | TouchEvent): void {
        event.stopPropagation();
        if (event instanceof MouseEvent && event.button !== 0) return;
        this.error = null;   
        this.type === "images" && this.loadImages();
        this.type === "videos" && this.loadVideos();
        this.type === "others" && this.loadOthers();
    }

    private async loadImages(): Promise<void> {
        try {                     
            const selectedFiles = await this.uploadService.selectFiles(true, "image") as File[];
            const limit = parseInt(this.settings[`limit-images`]) - this.data.length;
            const mustRemove = selectedFiles.length - limit;
            const files = mustRemove > 0 ? selectedFiles.slice(0, -mustRemove) : selectedFiles;

            for (let f of files) {
                const image = new CUserImage();
                image.url = f;
                image.pos = this.data.length ? Math.max(...this.data.map(d => d.pos)) + 1 : 0;
                this.data.push(image);
            }
        } catch (err) {
            this.error = "upload-image";
        }
    } 

    private async loadVideos(): Promise<void> {
        try {
            const selectedFiles = await this.uploadService.selectFiles(true, "video") as File[];
            const limit = parseInt(this.settings[`limit-videos`]) - this.data.length;
            const mustRemove = selectedFiles.length - limit;
            const files = mustRemove > 0 ? selectedFiles.slice(0, -mustRemove) : selectedFiles;

            for (let f of files) {
                const video = new CUserVideo();
                video.url = f;
                video.pos = this.data.length ? Math.max(...this.data.map(d => d.pos)) + 1 : 0;
                this.data.push(video);
            }
        } catch (err) {
            this.error = "upload-video";
        }
    } 

    private async loadOthers(): Promise<void> {
        try {
            const selectedFiles = await this.uploadService.selectFiles(true, "other") as File[];
            const limit = parseInt(this.settings[`limit-others`]) - this.data.length;
            const mustRemove = selectedFiles.length - limit;
            const files = mustRemove > 0 ? selectedFiles.slice(0, -mustRemove) : selectedFiles;

            for (let f of files) {
                const other = new CUserOther();
                other.name = f.name;
                other.url = f;
                other.pos = this.data.length ? Math.max(...this.data.map(d => d.pos)) + 1 : 0;
                this.data.push(other);
            }
        } catch (err) {
            this.error = "upload-other";
        }
    }     
}