import { Component, Input, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { CCatRepository } from "src/app/common/services/repositories/cat.repository";
import { CCountryRepository } from "src/app/common/services/repositories/country.repository";
import { CSocialRepository } from "src/app/common/services/repositories/social.repository";
import { CUserRepository } from "src/app/common/services/repositories/user.repository";
import { ICatSimple } from "src/app/model/entities/cat.simple.interface";
import { ICountrySimple } from "src/app/model/entities/country.simple.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IPageWords } from "src/app/model/entities/page.interface";
import { ISocial } from "src/app/model/entities/social.interface";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words.interface";
import { IKeyValue } from "src/app/model/keyvalue.interface";

@Component({
    selector: "resume-athlet",
    templateUrl: "resume-athlet.component.html",
    styleUrls: [
        "../resume.scss",
        "../../../../../common/styles/forms.scss",
    ],
})
export class CResumeAthletComponent implements OnInit {
    @Input() public pageWords: IPageWords;
    public chapter: string = "general";
    public chapters: string[] = ["general", "bio", "sport", "files"];
    public countries: IKeyValue<ICountrySimple[]> = null;
    public socials: ISocial[] = [];
    public cats: IKeyValue<ICatSimple[]> = null;
    public currentLang: ILang = null;
    public user: CUser = null;
    public errors: any = {};
    public agreePrivacy: boolean = true;
    public agreeTerms: boolean = true;
    public sending: boolean = false;
    public sent: boolean = false;
    public sportNameInput: boolean = false;
    public newSport: string;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private userRepository: CUserRepository,
        private countryRepository: CCountryRepository,
        private catRepository: CCatRepository,
        private socialRepository: CSocialRepository,
        private translate: TranslateService
    ) { }

    get lang(): ILang { return this.appService.lang; }
    get words(): IWords { return this.appService.words; }
    get category(): any[] { return this.appService.category; }

    public ngOnInit(): void {
        this.initLang();
        this.initUser();
        this.initCountries();
        this.initCats();
        this.initSocials();
    }

    private initLang(): void {
        this.currentLang = this.appService.langs[0];
    }

    private async initUser(): Promise<void> {
        try {
            this.user = await this.userRepository.loadMe();
            // this.user.athlet.category = this.category.find((e) => e.value == this.user.athlet.category);
            if (!this.user.athlet.metrics) {
                this.user.athlet.metrics = '{"physical_fitnes":{"fourty_yard_dash_time":"","vertical_jump_height":"","bench_press_max":"","squat_max":"","deadlift_max":""},"endurance":{"hundred_twoh_fourhm_time":"","fivek_tenk_run_time":"","marathon_time":""},"team_sport":{"goals_scored":"","assists":"","shooting_percentage":"","pass_completion_percentage":"","tackles_made":""},"accuracy":{"free_throw_percentage":"","field_goal_percentage":"","three_point_percentage":"","serve_accuracy":"","pitch_accuracy":""},"defensive":{"interceptions":"","blocks":"","steals":"","shutouts":"","saves":""},"statistics":{"career_points":"","seasonal_averages":"","personal_bests":""},"competition_records":{"championships_won":"","top_tournament_finishes":"","records_held":""}}';
            }
            this.user.athlet.metrics = JSON.parse(this.user.athlet.metrics);
            console.log("Asdf", this.user.athlet.metrics.physical_fitnes.fourty_yard_dash_time);
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

    private async initCats(): Promise<void> {
        try {
            this.cats = await this.catRepository.loadAllLeavs();
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
            // this.user.athlet.category = this.user.athlet.category.value;
            this.user.athlet.metrics = JSON.stringify(this.user.athlet.metrics);
            const status = await this.userRepository.updateMe(this.user);
            this.sending = false;

            if (status === 200) {
                this.sent = true;
                this.user = await this.userRepository.loadMe();
                // this.user.athlet.category = this.category.find((e) => e.value == this.user.athlet.category);
                if (!this.user.athlet.metrics) {
                    this.user.athlet.metrics = '{"physical_fitnes":{"fourty_yard_dash_time":"","vertical_jump_height":"","bench_press_max":"","squat_max":"","deadlift_max":""},"endurance":{"hundred_twoh_fourhm_time":"","fivek_tenk_run_time":"","marathon_time":""},"team_sport":{"goals_scored":"","assists":"","shooting_percentage":"","pass_completion_percentage":"","tackles_made":""},"accuracy":{"free_throw_percentage":"","field_goal_percentage":"","three_point_percentage":"","serve_accuracy":"","pitch_accuracy":""},"defensive":{"interceptions":"","blocks":"","steals":"","shutouts":"","saves":""},"statistics":{"career_points":"","seasonal_averages":"","personal_bests":""},"competition_records":{"championships_won":"","top_tournament_finishes":"","records_held":""}}';
                }
                this.user.athlet.metrics = JSON.parse(this.user.athlet.metrics);
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

        if (!this.user.athlet.img) {
            error = true;
            this.errors["img"] = "img";
        } else {
            this.errors["img"] = null;
        }

        if (!this.user.athlet.translation(1).firstname) {
            error = true;
            this.errors["firstname"] = "required-mainlang";
        } else {
            this.errors["firstname"] = null;
        }

        if (!this.user.athlet.translation(1).lastname) {
            error = true;
            this.errors["lastname"] = "required-mainlang";
        } else {
            this.errors["lastname"] = null;
        }

        if (!this.user.athlet.birthdate) {
            error = true;
            this.errors["birthdate"] = "required";
        } else {
            this.errors["birthdate"] = null;
        }

        if (!this.user.athlet.country_id) {
            error = true;
            this.errors["country_id"] = "required";
        } else {
            this.errors["country_id"] = null;
        }

        if (!this.user.athlet.cat_id) {
            error = true;
            this.errors["cat_id"] = "required";
        } else {
            this.errors["cat_id"] = null;
        }

        // contacts
        this.errors["phones"] = [];

        for (let i = 0; i < this.user.phones.length; i++) {
            if (!this.user.phones[i].value.length) {
                this.errors["phones"][i] = { "value": "phone" };
                error = true;
            }
        }

        this.errors["emails"] = [];

        for (let i = 0; i < this.user.emails.length; i++) {
            if (!this.appService.validateEmail(this.user.emails[i].value)) {
                this.errors["emails"][i] = { "value": "email" };
                error = true;
            }
        }

        this.errors["links"] = [];

        for (let i = 0; i < this.user.links.length; i++) {
            if (!this.user.links[i].value.includes("http://") && !this.user.links[i].value.includes("https://")) {
                this.errors["links"][i] = { "value": "link" };
                error = true;
            }
        }

        this.errors["socials"] = [];

        for (let i = 0; i < this.user.socials.length; i++) {
            if (!this.user.socials[i].social_id) {
                this.errors["socials"][i] = { "type": "social" };
                error = true;
            } else if ((!this.user.socials[i].value.includes("http://") && !this.user.socials[i].value.includes("https://")) || !this.user.socials[i].value.includes(this.socials.find(s => s.id === this.user.socials[i].social_id).url)) {
                this.errors["socials"][i] = { "value": "link" };
                error = true;
            }
        }

        // rewards
        this.errors["rewards"] = [];

        for (let i = 0; i < this.user.athlet.rewards.length; i++) {
            if (!this.user.athlet.rewards[i].translation(1).name) {
                this.errors["rewards"][i] = "required-mainlang";
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
        this.errors["chapter-general"] = !!(this.errors["img"] || this.errors["firstname"] || this.errors["lastname"] || this.errors["birthdate"] || this.errors["country_id"] || this.errors["phones"].length || this.errors["emails"].length || this.errors["links"].length || this.errors["socials"].length);
        this.errors["chapter-sport"] = !!(this.errors["cat_id"] || this.errors["rewards"].length);

        return !error;
    }

    public onCateChanged(): void {
        if (this.user.athlet.cat_id === -1) {
            this.sportNameInput = true;
        }
    }

    public closeInput(): void {
        this.sportNameInput = false;
    }

    public async saveSport(): Promise<void> {
        try {
            const res = await this.catRepository.addNewSport(this.newSport);
            this.initCats();
            this.user.athlet.cat_id = res.id;
            this.sportNameInput = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
