import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { cfg } from "src/app/app.config";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { CUploadService } from "src/app/common/services/upload.service";

@Component({
    selector: "image-picker",
    templateUrl: "image-picker.component.html",
    styleUrls: ["image-picker.component.scss"],
})
export class CImagePickerComponent implements OnChanges {
    @Input() folder: string;
    @Input() error: string = null;
    @Input() supabase: boolean = false;
    @Input() img: string | File;
    @Output() imgChange: EventEmitter<File> = new EventEmitter();

    public innerError: boolean = false;
    public viewerActive: boolean = false;
    public imgOut: string = null;

    constructor(
        private appService: CAppService,
        private uploadService: CUploadService,
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        this.buildImgOut();
    }

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    private buildImgOut(): void {
        this.imgOut = this.img ? 
            (typeof(this.img) === "string" ?                 
                (this.supabase ? `${cfg.supabaseUrl}/images/${this.folder}/${this.img}?t=${new Date().getTime()}` : `/images/${this.folder}/${this.img}?t=${new Date().getTime()}`) : 
                URL.createObjectURL(this.img)) : 
            null;
    }

    public async onSelect(): Promise<void> {
        try {
            this.innerError = false;
            this.imgChange.emit(await this.uploadService.selectFiles(false, "image") as File);            
        } catch (err) {
            this.innerError = true;
        }        
    }    

    public onDelete(): void {
        this.imgChange.emit(null);
    }    
}