import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Directive, ElementRef } from "@angular/core";
import { CAppService } from "../services/app.service";

type TMode = "img" | "video";

@Directive({selector: "[smart-media]"})
export class CSmartMediaDirective implements AfterViewInit {
    private mode: TMode;
    private originalSrc: string = null;
    private placeholders = {"img": "/images/no-image.svg", "video": "/videos/no-video.mp4"};

    constructor(
        private elementRef: ElementRef,
        private http: HttpClient,
        private appService: CAppService,
    ) {}

    get element(): HTMLImageElement {return this.elementRef.nativeElement;}    
    
    public ngAfterViewInit(): void {
        this.onError = this.onError.bind(this);  
        this.mode = this.element.tagName.toLowerCase() as TMode;
        this.element.addEventListener("error", this.onError);        
    }
    
    public onError(event): void {
        // this.originalSrc = this.element.src;        
        // this.element.src = this.placeholders[this.mode];
        // this.check();        
    } 

    private async check(): Promise<void> {
        await this.appService.pause(1000);
        const exists = await this.isExists();

        if (exists) {
            this.element.src = this.originalSrc;
            return;
        }
            
        this.element.src.includes(this.placeholders[this.mode]) && this.check(); // меняем обратно, только если еще не сменился src
    }

    private isExists(): Promise<boolean> {
        return new Promise((resolve, reject) => 
            this.http.head(this.originalSrc, {observe: "response"}).subscribe({
                next: res => resolve(res.status === 200),
                error: err => resolve(false),
            })); 
    }
}
