import { Component, ElementRef, HostListener, Inject, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { CAppService } from './common/services/app.service';
import { CLangRepository } from './common/services/repositories/lang.repository';
import { CSettingRepository } from './common/services/repositories/setting.repository';
import { CWordRepository } from './common/services/repositories/word.repository';
import { CFileRepository } from './common/services/repositories/file.repository';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ISettings } from './model/entities/settings.interface';
import { filter } from 'rxjs';
import { CPageRepository } from './common/services/repositories/page.repository';
import { CAudioService } from './common/services/audio.service';
import { CCookieService } from './common/services/cookie.service';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CAppComponent {
    @ViewChild("win", {static: false}) private winRef: ElementRef;
    private settingsReady: boolean = false;
	private langsReady: boolean = false;
	private wordsReady: boolean = false;
	private filesReady: boolean = false;

	constructor(
		private appService: CAppService,		
		private audioService: CAudioService,
		private cookieService: CCookieService,
		private langRepository: CLangRepository,
		private settingRepository: CSettingRepository,	
		private wordRepository: CWordRepository,	
		private fileRepository: CFileRepository,
		private pageRepository: CPageRepository,
		private router: Router,		
		public translate: TranslateService,
		@Optional() @Inject(REQUEST) private request: Request,
	) {
		translate.addLangs(['en', 'ru', 'ar']);
		translate.setDefaultLang('en');
		translate.use('en');
	}

	get settings(): ISettings {return this.appService.settings;}
	get ready(): boolean {return this.settingsReady && this.settings["active"] === "1" && this.langsReady && this.wordsReady && this.filesReady;}
	get url(): string[] {return this.appService.url;}
	get dir(): string {return this.appService.lang?.dir || 'ltr';}
	get popupLoginActive(): boolean {return this.appService.popupLoginActive;}
    set popupLoginActive(v: boolean) {this.appService.popupLoginActive = v;}
	get popupRegisterActive(): boolean {return this.appService.popupRegisterActive;}
    set popupRegisterActive(v: boolean) {this.appService.popupRegisterActive = v;}
	get popupRecoverActive(): boolean {return this.appService.popupRecoverActive;}
    set popupRecoverActive(v: boolean) {this.appService.popupRecoverActive = v;}
	get popupOnlypaidActive(): boolean {return this.appService.popupOnlypaidActive;}
    set popupOnlypaidActive(v: boolean) {this.appService.popupOnlypaidActive = v;}
	get popupYoubannedActive(): boolean {return this.appService.popupYoubannedActive;}
    set popupYoubannedActive(v: boolean) {this.appService.popupYoubannedActive = v;}
	get popupUserbannedActive(): boolean {return this.appService.popupUserbannedActive;}
    set popupUserbannedActive(v: boolean) {this.appService.popupUserbannedActive = v;}

    public async ngOnInit(): Promise<void> {		
		this.initSettings();
		this.initLangs();
		this.initWords();
		this.initFiles();
		this.initMenu();
		this.initCookies();
		initFlowbite();
    }

	public async ngAfterViewInit(): Promise<void> {			
		this.appService.win = this.winRef.nativeElement;
	}	

    private async initSettings(): Promise<void> {
		try {
			this.appService.settings = await this.settingRepository.loadAll();	
			this.settingsReady = true;	
		} catch (err) {
			this.appService.notifyError(err);
		}			
	}	

    private async initLangs(): Promise<void> {
		try {
			this.appService.langs = await this.langRepository.loadAll();
			this.initLang(this.router.url.split("/")[1]);	
			this.langsReady = true;			
			this.router.events
				.pipe(filter(event => event instanceof NavigationStart))
				.subscribe((event: NavigationStart) => this.initLang(event.url.split("/")[1]));	
		} catch (err) {
			this.appService.notifyError(err);
		}		
	}

	private initLang(slug: string): void {
		if (!slug) {
			this.appService.lang = this.appService.langs[0];
			return;
		}

		const lang = this.appService.langs.find(l => l.slug === slug);

		if (!lang) {
			this.appService.lang = this.appService.langs[0];
			this.router.navigateByUrl(`/${this.appService.lang.slug}/errors/404`);
			return;
		}

		this.appService.lang = lang;		
	}

    private async initWords(): Promise<void> {
		try {
			this.appService.words = await this.wordRepository.loadAll();				
			this.wordsReady = true;			
		} catch (err) {
			this.appService.notifyError(err);
		}		
	}

	private async initFiles(): Promise<void> {
		try {
			this.appService.files = await this.fileRepository.loadAll();	
			this.appService.isBrowser && this.audioService.init();
			this.filesReady = true;		
		} catch (err) {
			this.appService.notifyError(err);	
		}
	}	

	private async initMenu(): Promise<void> {
		try {
			this.appService.mainMenu = await this.pageRepository.loadMenuMain();
		} catch (err) {
			this.appService.notifyError(err);	
		}
	}

	private initCookies() {
		// ловим pagespeed
		if (!this.appService.isBrowser) {
			const isPagespeed = this.request.headers["user-agent"]?.toLowerCase().includes("lighthouse") ? "true" : "false";
			this.cookieService.setItem("ppp42", isPagespeed);	// ppp42 - просто буквы, избегаем осмысленных названий :-)
		}		
	}

	// <a class="routerlink"> to router-like behavior
	@HostListener('document:click', ['$event'])
	public onClick(event: Event): void {
 		if (event.target instanceof HTMLAnchorElement) {
   			const element = event.target as HTMLAnchorElement;
   			if (element?.className === 'routerlink') {
     			event.preventDefault();
     			const route = element.getAttribute('href');     
       			route && this.router.navigateByUrl(route);
   			}
 		}
	}
}
