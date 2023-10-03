import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CAppService } from "src/app/common/services/app.service";
import { CUserRepository } from "src/app/common/services/repositories/user.repository";
import { ILang } from "src/app/model/entities/lang.interface";
import { IPageWords } from "src/app/model/entities/page.interface";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "profile",
    templateUrl: "profile.component.html",
    styleUrls: ["../../../../common/styles/forms.scss"],    
})
export class CProfileComponent implements OnInit {
    @Input() pageWords: IPageWords;
    public user: CUser = null;

    constructor(
        private appService: CAppService,
        private userRepository: CUserRepository,
        private router: Router,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get langs(): ILang[] {return this.appService.langs;}
    get words(): IWords {return this.appService.words;}
    get isBrowser(): boolean {return this.appService.isBrowser;}

    public ngOnInit(): void {
        this.initUser();
    }

    private async initUser(): Promise<void> {
        try {
            this.user = await this.userRepository.loadMe();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    ///////////////
    // update
    ///////////////

    public updateErrors: any = {};
    public updating: boolean = false;
    public updated: boolean = false;

    public async onUpdate(): Promise<void> {
        try {
            if (!this.updateValidate()) return;
            this.updating = true;
            const status = await this.userRepository.updateMe(this.user);
            this.updating = false;

            if (status === 200) {
                this.updated = true;
                await this.appService.pause(3000);
                this.updated = false;
                return;
            }

            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.updating = false;
        }
    }

    private updateValidate(): boolean {
        let error = false;

        if (this.user.password && this.user.password.length < 6) {
            this.updateErrors["password"] = "password";
            error = true;
        } else {
            this.updateErrors["password"] = null;
        }

        return !error;
    }

    ////////////////////
    // delete
    ////////////////////

    public deletePassword: string = "";
    public deleteErrors: any = {};
    public deleting: boolean = false;

    public async onDelete(): Promise<void> {
        try {
            if (!this.deleteValidate() || !window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;
            this.deleting = true;
            this.deleteErrors["form"] = null;
            const status = await this.userRepository.deleteMe(this.deletePassword);
            this.deleting = false;

            if (status === 401) {
                this.deleteErrors["form"] = "denied";
                await this.appService.pause(2000);
                this.deleteErrors["form"] = null;   
                return;
            }

            if (status === 200) {
                this.router.navigateByUrl(`/${this.lang.slug}/auth/logout`);
                return;
            }

            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.deleting = false;
        }
    }

    private deleteValidate(): boolean {
        let error = false;

        if (!this.deletePassword) {
            this.deleteErrors["password"] = "required";
            error = true;
        } else {
            this.deleteErrors["password"] = null;
        }

        return !error;
    }
}