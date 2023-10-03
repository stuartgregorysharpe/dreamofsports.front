import { Component, Input, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { CCountryRepository } from "src/app/common/services/repositories/country.repository";
import { CSocialRepository } from "src/app/common/services/repositories/social.repository";
import { CUserRepository } from "src/app/common/services/repositories/user.repository";
import { ICountrySimple } from "src/app/model/entities/country.simple.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IPageWords } from "src/app/model/entities/page.interface";
import { ISocial } from "src/app/model/entities/social.interface";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words.interface";
import { IKeyValue } from "src/app/model/keyvalue.interface";

@Component({
    selector: "resume-firm",
    templateUrl: "resume-firm.component.html",
    styleUrls: [
        "../resume.scss",
        "../../../../../common/styles/forms.scss",
    ],
})
export class CResumeFirmComponent implements OnInit {
    @Input() public pageWords: IPageWords;
    public chapter: string = "general"; 
    public chapters: string[] = ["general", "about", "files"];
    public countries: IKeyValue<ICountrySimple[]> = null;
    public socials: ISocial[] = [];
    public currentLang: ILang = null;
    public user: CUser = null;
    public errors: any = {};    
    public agreePrivacy: boolean = true;
    public agreeTerms: boolean = true;
    public sending: boolean = false;
    public sent: boolean = false;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private userRepository: CUserRepository,
        private countryRepository: CCountryRepository,
        private socialRepository: CSocialRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.initLang();
        this.initUser();
        this.initCountries();
        this.initSocials();
    }

    private initLang(): void {
        this.currentLang = this.appService.langs[0];
    }

    private async initUser(): Promise<void> {
        try {
            this.user = await this.userRepository.loadMe();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    private async initCountries(): Promise<void> {
        try {
            this.countries = await this.countryRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    private async initSocials(): Promise<void> {
        try {
            this.socials = await this.socialRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onNext(chapter: string): void {
        this.chapter = chapter;
        this.appService.scrollWinTo("resume-top", "only-up");
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validate() || this.sending || this.sent) return;            
            this.sending = true;
            this.user.filled = true;
            const status = await this.userRepository.updateMe(this.user);
            this.sending = false;

            if (status === 200) {
                this.sent = true;
                await this.authService.loadMe();                
                await this.appService.pause(3000);
                this.sent = false;
                return;
            }

            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.sending = false;
        }
    }

    private validate(): boolean {
        let error = false;

        if (!this.user.firm.img) {
            error = true;
            this.errors["img"] = "img";
        } else {
            this.errors["img"] = null;
        }

        if (!this.user.firm.translation(1).name) {
            error = true;
            this.errors["name"] = "required-mainlang";
        } else {
            this.errors["name"] = null;
        }

        if (!this.user.firm.reg_no) {
            error = true;
            this.errors["reg_no"] = "required";
        } else {
            this.errors["reg_no"] = null;
        }

        if (!this.user.firm.reg_date) {
            error = true;
            this.errors["reg_date"] = "required";
        } else {
            this.errors["reg_date"] = null;
        }

        if (!this.user.firm.reg_country_id) {
            error = true;
            this.errors["reg_country_id"] = "required";
        } else {
            this.errors["reg_country_id"] = null;
        }

        if (!this.user.firm.translation(1).reg_addr) {
            error = true;
            this.errors["reg_addr"] = "required-mainlang";
        } else {
            this.errors["reg_addr"] = null;
        }        

        // contacts
        this.errors["phones"] = [];

        for (let i = 0; i < this.user.phones.length; i++) {
            if (!this.user.phones[i].value.length) {                
                this.errors["phones"][i] = {"value": "phone"};                
                error = true;
            }
        }

        this.errors["emails"] = [];

        for (let i = 0; i < this.user.emails.length; i++) {
            if (!this.appService.validateEmail(this.user.emails[i].value)) {                
                this.errors["emails"][i] = {"value": "email"};                
                error = true;
            }
        }

        this.errors["links"] = [];

        for (let i = 0; i < this.user.links.length; i++) {
            if (!this.user.links[i].value.includes("http://") && !this.user.links[i].value.includes("https://")) {                
                this.errors["links"][i] = {"value": "link"};                
                error = true;
            }
        }

        this.errors["socials"] = [];

        for (let i = 0; i < this.user.socials.length; i++) {
            if (!this.user.socials[i].social_id) {
                this.errors["socials"][i] = {"type": "social"};
                error = true;
            } else if ((!this.user.socials[i].value.includes("http://") && !this.user.socials[i].value.includes("https://")) || !this.user.socials[i].value.includes(this.socials.find(s => s.id === this.user.socials[i].social_id).url)) {
                this.errors["socials"][i] = {"value": "link"};
                error = true;
            }
        }

        // agrees
        if (!this.agreePrivacy) {
            this.errors['privacy'] = true;
            error = true;
        } else {
            this.errors['privacy'] = false;
        }

        if (!this.agreeTerms) {
            this.errors['terms'] = true;
            error = true;
        } else {
            this.errors['terms'] = false;
        }

        // chapters
        this.errors["chapter-general"] = !!(this.errors["img"] || this.errors["name"] || this.errors["reg_no"] || this.errors["reg_date"] || this.errors["reg_country_id"] || this.errors["reg_addr"] || this.errors["phones"].length || this.errors["emails"].length || this.errors["links"].length || this.errors["socials"].length);

        return !error;
    }
}
