import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { CGoogleService } from "src/app/common/services/google.service";
import { CAuthGuard } from "src/app/common/services/guards/auth.guard";
import { TUserType } from "src/app/model/dto/user.authdata.interface";
import { IUserEnterByEmail } from "src/app/model/dto/user.enterbyemail.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "google-entered-page",
    templateUrl: "google-entered.page.html",
})
export class CGoogleEnteredPage implements OnInit {
    constructor(
        private appService: CAppService,        
        private googleService: CGoogleService,
        private authService: CAuthService,  
        private authGuard: CAuthGuard,
        private router: Router,       
        private route: ActivatedRoute,
    ) {}

    get type(): TUserType {return this.route.snapshot.params["type"];}
    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.appService.isBrowser && this.enter();
    }

    private async enter(): Promise<void> {
        try {
            const email = await this.googleService.getUserEmail();
            const dto: IUserEnterByEmail = {lang_id: this.lang.id, type: this.type, email, firstName: "", lastName: "", phoneNumber: ""};
            const status = await this.authService.enterByEmail(dto);

            if ([200,201].includes(status)) {
                const url = this.authGuard.getBlockedUrl() || `/${this.lang.slug}/account`;
                this.router.navigateByUrl(url);                   
                return;     
            }

            if (status === 401) {
                this.router.navigateByUrl(`/${this.lang.slug}/errors/401`);
                return;
            }

            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
            this.router.navigateByUrl(`/${this.lang.slug}`);
        } catch (err) {
            this.appService.notifyError(err);
            this.router.navigateByUrl(`/${this.lang.slug}`);
        }
    }
}
