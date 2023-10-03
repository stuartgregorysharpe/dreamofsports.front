import { Component, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { IKeyValue } from "src/app/model/keyvalue.interface";
import { CAppService } from "src/app/common/services/app.service";
import { CPopupComponent } from "../popup.component";
import { CAuthService } from "src/app/common/services/auth.service";
import { IUserRecover } from "src/app/model/dto/user.recover.interface";
import { IUserVerify } from "src/app/model/dto/user.verify.interface";

@Component({
    selector: "popup-recover",
    templateUrl: "popup-recover.component.html",
    styleUrls: [
        "../popup.component.scss",
        "../../../styles/forms.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupRecoverComponent extends CPopupComponent implements OnChanges {
    public email: string = "";
    public code: string = "";
    public codeSent: boolean = false;
    public codeSending: boolean = false;
    public password: string = "";
    public password2: string = "";
    public errors: IKeyValue<string> = {};
    public formSending: boolean = false;    
    public passwordChanged: boolean = false;

    constructor(
        protected appService: CAppService,
        protected authService: CAuthService,
    ) 
    {
        super(appService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        !this.active && this.reset();
    }

    private reset(): void {
        this.password = "";
        this.password2 = "";
        this.code = "";
        this.passwordChanged = false;
        this.errors = {};
    }

    public async onLogin(): Promise<void> {
        this.onClose();
        await this.appService.pause(500);
        this.appService.popupLoginActive = true;
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validateForm()) return;
            this.formSending = true;
            const dto: IUserRecover = {email: this.email, code: this.code, password: this.password};
            const statusCode = await this.authService.recover(dto);
            this.formSending = false;

            if (statusCode === 200) {
                this.passwordChanged = true;
                return;                            
            } 
            
            if (statusCode === 404) {
                this.errors["email"] = "email-not-exists";   
                return;
            } 

            if (statusCode === 401) {
                this.errors["code"] = "code-invalid";   
                return;
            } 
            
            this.onClose();  
            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.formSending = false;
        }
    } 

    public async onSendCode(): Promise<void> {
        try {
            if (!this.validateEmail()) return;
            this.codeSending = true;
            const dto: IUserVerify = {email: this.email, lang_id: this.lang.id};
            await this.authService.verify(dto);
            this.codeSending = false;
            this.codeSent = true;
            await this.appService.pause(3000);
            this.codeSent = false;
        } catch (err) {
            this.appService.notifyError(err);
            this.codeSending = false;
        }
    }

    private validateForm(): boolean {
        let error = false;

        if (!this.appService.validateEmail(this.email)) {
            this.errors["email"] = "email";
            error = true;
        } else {
            this.errors["email"] = null;
        }

        if (!this.code) {
            this.errors["code"] = "required";
            error = true;
        } else {
            this.errors["code"] = null;
        }

        if (this.password.length < 6) {
            this.errors["password"] = "password";
            error = true;
        } else {
            this.errors["password"] = null;
        }

        if (this.password2 !== this.password) {
            this.errors["password2"] = "password2";
            error = true;
        } else {
            this.errors["password2"] = null;
        }

        return !error;
    }

    private validateEmail(): boolean {
        let error = false;

        if (!this.appService.validateEmail(this.email)) {
            this.errors["email"] = "email";
            error = true;
        } else {
            this.errors["email"] = null;
        }

        return !error;
    }
}