import { DOCUMENT, isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { IFiles } from "src/app/model/entities/files.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IPage } from "src/app/model/entities/page.interface";
import { ISettings } from "src/app/model/entities/settings.interface";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words.interface";
import { IKeyValue } from "src/app/model/keyvalue.interface";

@Injectable()
export class CAppService {
    public userType: any[] = [
        { name: 'Athlete', type: "athlet", sub_type: "Athlet" },
        { name: 'Athletic Director', type: "athlet", sub_type: "Athletic Director" },
        { name: 'Coach', type: "athlet", sub_type: "Coach" },
        { name: 'Company', type: "firm", sub_type: "Company" },
        { name: 'Fan', type: "fan", sub_type: "Fan" },
        { name: 'Professional Sports Club', type: "firm", sub_type: "Professional Sports Club" },
        { name: 'Scout', type: "athlet", sub_type: "Scout" },
        { name: 'Sports Agent', type: "athlet", sub_type: "Sports Agent" },
        { name: 'Sports Manager', type: "athlet", sub_type: "Sports Manager" },
        { name: 'Sports Recruiter', type: "athlet", sub_type: "Sports Recruiter" },
    ]
    public category: any[] = [
        { name: "Amateur Athlete", value: 1 },
        { name: "Aspiring Athlete", value: 2 },
        { name: "Semi-Professional Athlete", value: 3 },
        { name: "Professional Athlete", value: 4 },
        { name: "Retired Athlete", value: 5 },
        { name: "Paralympic Athlete", value: 6 },
        { name: "Student-Athlete", value: 7 },
        { name: "Amateur to Professional Transition", value: 8 }
    ]
    // data   
    public settings: ISettings = {};
    public lang: ILang = null;
    public langs: ILang[] = [];
    public words: IWords = {};
    public files: IFiles = {};
    public page: IPage = null; // save here to prevent reinit object and extra-blinking in layout
    public mainMenu: IPage[] = []; // main menu, save here to prevent double request
    // iface
    public win: HTMLElement = null;
    public notifyErrorActive: boolean = false;
    public notifyErrorMsg: string = "";
    public notifyErrorTimer: number = null;
    public popupLoginActive: boolean = false;
    public popupRegisterActive: boolean = false;
    public popupRecoverActive: boolean = false;
    public popupOnlypaidActive: boolean = false;
    public popupYoubannedActive: boolean = false;
    public popupUserbannedActive: boolean = false;
    public popupUserbannedId: number = null;

    constructor(
        private titleService: Title,
        private metaService: Meta,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(DOCUMENT) private document: any,
    ) { }

    get url(): string[] { return this.router.url.split("?")[0].split("/"); }
    get isBrowser(): boolean { return isPlatformBrowser(this.platformId); }
    get isServer(): boolean { return isPlatformServer(this.platformId); }
    get headerOffset(): number { return this.win.offsetWidth < 1000 ? 50 : 60; }

    ////////////////////////
    // errors
    ////////////////////////

    public notifyError(error: any): void {
        if (this.isBrowser) {
            this.notifyErrorTimer && window.clearTimeout(this.notifyErrorTimer);
            this.notifyErrorMsg = typeof (error) !== "string" ? JSON.stringify(error) : error;
            this.notifyErrorActive = true;
            this.notifyErrorTimer = window.setTimeout(() => {
                this.notifyErrorActive = false;
                this.notifyErrorTimer = null;
            }, 3000);
        }

        console.log(error);
    }

    ////////////////////////
    // SEO, links etc.
    ////////////////////////

    public setTitle(title: string) {
        this.titleService.setTitle(`${title}`);
    }

    public setMeta(keyfield: "name" | "property", keyfieldvalue: string, content: string): void {
        // <meta name='{keyfieldvalue}' content='{content}'> or <meta property='{keyfieldvalue}' content='{content}'>
        this.metaService.removeTag(`${keyfield}="${keyfieldvalue}"`);
        content ? this.metaService.addTag({ [keyfield]: keyfieldvalue, content }) : null;
    }

    public getLangLink(lang: ILang, mode: "url" | "fragment" | "queryParams"): string | IKeyValue<string> {
        if (mode === "fragment") return this.getLangLinkFragment(lang);
        if (mode === "queryParams") return this.getLangLinkQueryParams(lang);
        return this.getLangLinkUrl(lang);
    }

    public getLangLinkUrl(lang: ILang): string {
        let delimiter = this.router.url.includes("#") ? "#" : (this.router.url.includes("?") ? "?" : "");
        let preurl;

        if (delimiter) {
            const urlParts = this.router.url.split(delimiter);
            preurl = urlParts[0].split("/");
        } else {
            preurl = this.router.url.split("/");
        }

        preurl.splice(0, 2);
        return `/${lang.slug}/${preurl.join("/")}`;
    }

    public getLangLinkFragment(lang: ILang): string {
        const urlParts = this.router.url.split("#");
        const fragment = urlParts[1] ? decodeURI(urlParts[1]) : null;
        return fragment;
    }

    public getLangLinkQueryParams(lang: ILang): IKeyValue<string> {
        const queryParams = {};
        const urlParts = this.router.url.split("?");

        if (urlParts[1]) {
            const queryParamsParts = urlParts[1].split("&");

            for (let qpp of queryParamsParts) {
                const qppParts = qpp.split("=");
                queryParams[qppParts[0]] = qppParts[1];
            }
        }

        return queryParams;
    }

    /*
    public setHreflang(): void {
        const headElement: HTMLHeadElement = this.document.querySelector('head');
        
        for (let lang of this.langs) {
            const url = this.url.length > 2 ? 
                `${cfg.siteUrl}/${lang.slug}/${this.url.slice(2).join("/")}` : 
                (lang.id === 1 ? cfg.siteUrl : `${cfg.siteUrl}/${lang.slug}`);
            const linkElement = this.document.createElement('link');
            linkElement.setAttribute('rel', 'alternate');
            linkElement.setAttribute('hreflang', lang.slug);
            linkElement.setAttribute('href', url);
            headElement.appendChild(linkElement);
        }     
    }
    */

    ///////////////////
    // strings
    ///////////////////

    public validateEmail(email: string): boolean {
        const re: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email?.toLowerCase());
    }

    public twoDigits(n: number): string {
        return (n < 10) ? `0${n}` : `${n}`;
    }

    public onlyDigits(s: string): string {
        return s.replace(/\D/g, '');
    }

    ///////////////////
    // rnd
    ///////////////////

    public rnd(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public rndId(): number {
        return this.rnd(1000000000, 9999999999);
    }

    ///////////////////
    // DOM
    ///////////////////

    // when element clicked, check DOM tree for existence of one of ids
    public pathHasIds(elements: HTMLElement[], ids: string[]): boolean {
        for (let element of elements) {
            for (let id of ids) {
                if (element.id === id) {
                    return true;
                }
            }
        }

        return false;
    }

    // when element clicked, check DOM tree for existence of one of class
    public pathHasClasses(elements: HTMLElement[], classNames: string[]): boolean {
        for (let element of elements) {
            for (let className of classNames) {
                if (element.classList?.contains(className)) {
                    return true;
                }
            }
        }

        return false;
    }

    public smoothScroll(from: number, to: number, duration: number, element: HTMLElement | Window): void {
        const change = to - from;
        const increment = 10;
        let currentTime = 0;
        const animateScroll = () => {
            currentTime += increment;
            const val = this.easeInOutQuad(currentTime, from, change, duration);
            element.scrollTo(0, val);
            currentTime < duration && setTimeout(animateScroll, increment);
        };
        animateScroll();
    }

    public scrollWinTo(blockName: string, mode: "only-up" | "anyway" = "anyway"): void {
        const element = window.document.querySelector(`[name='${blockName}']`) as HTMLElement;
        if (!element) return;
        if (mode === "only-up" && this.win.scrollTop <= element.offsetTop - this.headerOffset) return;
        this.smoothScroll(this.win.scrollTop, element.offsetTop - this.headerOffset, 300, this.win);
    }

    public isOverlapped(e1: HTMLElement, e2: HTMLElement): boolean {
        const rect1 = e1.getBoundingClientRect();
        const rect2 = e2.getBoundingClientRect();

        // one rectangle is on left side of other
        if (rect1.left > rect2.right || rect2.left > rect1.right)
            return false;

        // one rectangle is above other
        if (rect1.bottom < rect2.top || rect2.bottom < rect1.top)
            return false;

        return true;
    }

    public overlapSquare(e1: HTMLElement, e2: HTMLElement): number {
        const rect1 = e1.getBoundingClientRect();
        const rect2 = e2.getBoundingClientRect();
        const xOverlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
        const yOverlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
        return xOverlap * yOverlap;
    }

    public cloneStyles(from: HTMLElement, to: HTMLElement): void {
        const styles = window.getComputedStyle(from);
        const cssText = styles.cssText || Array.from(styles).reduce((str, property) => `${str}${property}:${styles.getPropertyValue(property)};`, '');
        to.style.cssText = cssText;
    }

    public getParents(elem: HTMLElement): HTMLElement[] {
        const parents = [];

        while (elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
            elem = elem.parentNode as HTMLElement;
            parents.push(elem);
        }

        return parents;
    }

    /*
    public getElementById(id: string): Promise<HTMLElement> {
        return new Promise((resolve, reject) => {
            const check = () => {
                const element = document.getElementById(id);
                element ? resolve(element) : setTimeout(() => check(), 100);
            };
            check();
        });
    }
    */

    ///////////////////
    // arrays
    ///////////////////

    public range(a: number, b: number): number[] {
        const arr: number[] = [];

        for (let i = a; i <= b; i++) {
            arr.push(i);
        }

        return arr;
    }

    public moveArrayElement(arr: any[], from, to) {
        const element = arr.splice(from, 1)[0]; // exclude element
        arr.splice(to, 0, element); // insert element
    }

    //////////////////
    // dates
    //////////////////

    public firstDayOfWeekInMonth(month: number, year: number): number {
        let firstDayOfMonth: number = new Date(year, month, 1).getDay() - 1;

        if (firstDayOfMonth === -1) {
            firstDayOfMonth = 6;
        }

        return firstDayOfMonth;
    }

    public daysInMonth(month: number, year: number): number {
        return 32 - new Date(year, month, 32).getDate()
    }

    public mysqlDate(date: Date, withTime: boolean = false): string {
        return withTime ?
            `${date.getFullYear()}-${this.twoDigits(date.getMonth() + 1)}-${this.twoDigits(date.getDate())} ${this.twoDigits(date.getHours())}:${this.twoDigits(date.getMinutes())}:${this.twoDigits(date.getSeconds())}` :
            `${date.getFullYear()}-${this.twoDigits(date.getMonth() + 1)}-${this.twoDigits(date.getDate())}`;
    }

    /*
    public formattedDate(date: Date): string {
        return date ? `${this.twoDigits(date.getDate())}.${this.twoDigits(date.getMonth()+1)}.${date.getFullYear()}` : this.words["common"]?.["empty2"]?.[this.lang.slug];
    }

    
    */

    ///////////////////
    // misc
    ///////////////////

    public pause(ms: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), ms);
        });
    }

    private easeInOutQuad(t: number, b: number, c: number, d: number): number {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    /*
    public async smoothChange(o: any, field: string, to: number, duration: number): Promise<void> {
        const from = o[field];
        const change = to - from;        
        const increment = 10;	
        let currentTime = 0;
        const doStep = async () => {    
            currentTime += increment;
            o[field] = this.easeInOutQuad(currentTime, from, change, duration);

            if (currentTime < duration) {
                await this.pause(increment);
                await doStep();
            }
        };
        await doStep();	
    }

    
    */

    /*
    public isEmpty(v: any): boolean {
        return v === null || v === undefined;
    }
    */
}
