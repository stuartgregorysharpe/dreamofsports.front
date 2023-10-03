import { Directive } from "@angular/core";
import { cfg } from "src/app/app.config";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Directive()
export abstract class CUserDetailsComponent {
    public viewerImg: string = "";
    public viewerType: "images" | "videos" = "images";
    public viewerActive: boolean = false;
    public complaintActive: boolean = false;

    constructor(
        protected appService: CAppService,
        protected authService: CAuthService,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get langs(): ILang[] {return this.appService.langs;}
    get words(): IWords {return this.appService.words;}
    get supabaseUrl(): string {return cfg.supabaseUrl;}
    get authenticated(): boolean {return this.authService.authData !== null;}

    public onViewImg(url: string): void {
        this.viewerImg = url;
        this.viewerType = "images";
        this.viewerActive = true;
    }

    public onViewVideo(url: string): void {
        this.viewerImg = url;
        this.viewerType = "videos";
        this.viewerActive = true;
    }

    public onComplain(): void {
        this.complaintActive = true;
    }
}