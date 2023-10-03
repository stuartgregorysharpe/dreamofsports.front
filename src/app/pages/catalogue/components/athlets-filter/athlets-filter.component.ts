import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { ICat } from "src/app/model/entities/cat.interface";
import { CCatRepository } from "src/app/common/services/repositories/cat.repository";
import { IMultilangable } from "src/app/model/multilangable.interface";
import { IKeyValue } from "src/app/model/keyvalue.interface";
import { ICountrySimple } from "src/app/model/entities/country.simple.interface";
import { CCountryRepository } from "src/app/common/services/repositories/country.repository";
import { Router } from "@angular/router";
import { CAthletsFilterService, IAthletsFilter } from "src/app/common/services/athlets-filter.service";

interface IAge {
    range: number[];
    name: IMultilangable;
}

interface IStatus {
    top: boolean;
    name: IMultilangable;
}

interface IGender {
    type: string;
    name: IMultilangable;
}

@Component({
    selector: "athlets-filter",
    templateUrl: "athlets-filter.component.html",
    styleUrls: ["athlets-filter.component.scss"],
})
export class CAthletsFilterComponent implements OnInit {
    public cats: ICat[] = [];
    public ages: IAge[] = [];
    public countries: IKeyValue<ICountrySimple[]> = null;
    public statuses: IStatus[] = [];
    public genders: IGender[] = [];

    constructor(
        private appService: CAppService,
        private filterService: CAthletsFilterService,
        private catRepository: CCatRepository,
        private countryRepository: CCountryRepository,
        private router: Router,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get langs(): ILang[] {return this.appService.langs;}
    get words(): IWords {return this.appService.words;}
    get filter(): IAthletsFilter {return this.filterService.filter;}

    public ngOnInit(): void {
        this.initCats();
        this.initAges();
        this.initCountries();
        this.initStatuses();
        this.initGenders();
    }

    private async initCats(): Promise<void> {
        try {
            this.cats = await this.catRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    private initAges(): void {  
        const buildAgeName = prefix => {
            const res: IMultilangable = {};

            for (let lang of this.langs) {
                res[lang.slug] = `${prefix} ${this.words['common']?.['years']?.[lang.slug]}`;
            }

            return res;
        };
        
        this.ages = [
            {range: [18, 20], name: buildAgeName("18-20")},
            {range: [21, 25], name: buildAgeName("21-25")},
            {range: [26, 30], name: buildAgeName("26-30")},
            {range: [31, 35], name: buildAgeName("31-35")},
            {range: [36, 40], name: buildAgeName("36-40")},
            {range: [41, 45], name: buildAgeName("41-45")},
            {range: [46, 50], name: buildAgeName("46-50")},
            {range: [51, 55], name: buildAgeName("51-55")},
            {range: [56, 60], name: buildAgeName("56-60")},
            {range: [60, 999], name: buildAgeName(">60")},
        ];
    }

    private initStatuses(): void {
        const buildStatusName = key => {
            const res: IMultilangable = {};

            for (let lang of this.langs) {
                res[lang.slug] = this.words['athlet']?.[key]?.[lang.slug];
            }

            return res;
        };

        this.statuses = [
            {top: true, name: buildStatusName("top-status")},
            {top: false, name: buildStatusName("not-top-status")},
        ];
    }

    private async initCountries(): Promise<void> {
        try {
            this.countries = await this.countryRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    private initGenders(): void {
        const buildGenderName = key => {
            const res: IMultilangable = {};

            for (let lang of this.langs) {
                res[lang.slug] = this.words['athlet']?.[key]?.[lang.slug];
            }

            return res;
        };

        this.genders = [
            {type: "m", name: buildGenderName("gender-m")},
            {type: "f", name: buildGenderName("gender-f")},
        ];
    }

    public onSelectCat(slug: string): void {
        const addr = slug ? `/${this.lang.slug}/catalogue/${slug}` : `/${this.lang.slug}/catalogue`;
        this.router.navigateByUrl(addr);        
    }
}