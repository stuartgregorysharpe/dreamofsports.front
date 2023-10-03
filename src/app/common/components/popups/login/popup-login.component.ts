import { Component, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { IKeyValue } from "src/app/model/keyvalue.interface";
import { CAppService } from "src/app/common/services/app.service";
import { CPopupComponent } from "../popup.component";
import { CAuthService } from "src/app/common/services/auth.service";
import { IUserLogin } from "src/app/model/dto/user.login.interface";
import { CGoogleService } from "src/app/common/services/google.service";
import { CLinkedinService } from "src/app/common/services/linkedin.service";
import { TUserType } from "src/app/model/dto/user.authdata.interface";
import { CAuthGuard } from "src/app/common/services/guards/auth.guard";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "popup-login",
    templateUrl: "popup-login.component.html",
    styleUrls: [
        "../popup.component.scss",
        "../../../styles/forms.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupLoginComponent extends CPopupComponent implements OnChanges {
    // public type: TUserType = "athlet";
    public type: any = this.appService.userType[0];
    public email: string = "";
    public password: string = "";
    public errors: IKeyValue<string> = {};
    public sending: boolean = false;    

    constructor(
        protected appService: CAppService,
        protected authService: CAuthService,
        protected authGuard: CAuthGuard,
        protected googleService: CGoogleService,
        protected linkedinService: CLinkedinService,
        protected router: Router,
        public translate: TranslateService
    ) 
    {
        super(appService);
    }

    get types(): any[] { return this.appService.userType}

    public ngOnChanges(changes: SimpleChanges): void {
        !this.active && this.reset();
    }

    private reset(): void {
        this.password = "";
        this.errors = {};
    }

    public async onRegister(): Promise<void> {
        this.onClose();
        await this.appService.pause(500);
        this.appService.popupRegisterActive = true;
    }

    public async onRecover(): Promise<void> {
        this.onClose();
        await this.appService.pause(500);
        this.appService.popupRecoverActive = true;
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validateForm()) return;
            this.sending = true;
            this.errors["form"] = null;
            const dto: IUserLogin = {type: this.type.type, email: this.email, password: this.password};
            const statusCode = await this.authService.login(dto);
            this.sending = false;

            if (statusCode === 200) {
                this.onClose();      
                const url = this.authGuard.getBlockedUrl() || `/${this.lang.slug}/account`;
                this.router.navigateByUrl(url);    
                return;                            
            } 
            
            if (statusCode === 401) {
                this.errors["form"] = "denied";   
                await this.appService.pause(2000);
                this.errors["form"] = null;   
                return;
            } 
            
            this.onClose();  
            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.sending = false;
        }
    } 

    public onEnterWithGoogle(): void {
        this.googleService.signIn(this.type);
    }

    public onEnterWithLinkedin(): void {
        this.linkedinService.signIn(this.type);
    }

    private validateForm(): boolean {
        let error = false;

        if (!this.email) {
            this.errors["email"] = "required";
            error = true;
        } else {
            this.errors["email"] = null;
        }

        if (!this.password) {
            this.errors["password"] = "required";
            error = true;
        } else {
            this.errors["password"] = null;
        }

        return !error;
    }
}