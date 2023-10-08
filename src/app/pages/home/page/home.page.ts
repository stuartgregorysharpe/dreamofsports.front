import { Component, ElementRef, ViewChild, OnInit, ViewEncapsulation } from "@angular/core";
import { CSimplePage } from "../../simple.page";
import { IFiles } from "src/app/model/entities/files.interface";
import { CAppService } from "src/app/common/services/app.service";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { CAuthService } from "src/app/common/services/auth.service";
import { cfg } from "src/app/app.config";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";

@Component({
    selector: "home-page",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CHomePage extends CSimplePage implements OnInit {
    get isBrowser(): boolean { return this.appService.isBrowser; }
    get files(): IFiles { return this.appService.files; }
    mobileDialogVisible: boolean = false;
    public athlets: IAthletOut[] = null;
    public currentSlide = 0;
    public currentImage = 0;

    @ViewChild('carouselText') carouselText: ElementRef;
  
    public images = [
        'https://img001.prntscr.com/file/img001/fm4Rz-yIQ1mdulQQbRIOVw.png',
        'https://img001.prntscr.com/file/img001/V18oAguzSC-rG9NrD1yHhA.png',
        'https://img001.prntscr.com/file/img001/uYgyfkNPTN2_aLiMng2Z6A.png',
        'https://img001.prntscr.com/file/img001/sK2ipUkFSbuRQZYW5Feqew.png',
    ];

    constructor(
        protected appService: CAppService,
        protected pageRepository: CPageRepository,
        protected athletRepository: CAthletRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService,
        protected authService: CAuthService
    ) {
        super(appService, pageRepository, route, router, deviceDetector);
    }
    
    get userImg(): string {
        if (!this.authService.authData) return "/imgages/default-avatar.jpg";

        if (this.authService.user?.type === "athlet") {
            return this.authService.user?.athlet.img ? `${cfg.supabaseUrl}/images/users/${this.authService.user?.athlet.img_s}` : '/images/default-avatar.jpg';
        } else {
            return this.authService.user?.firm.img ? `${cfg.supabaseUrl}/images/users/${this.authService.user?.firm.img_s}` : '/images/default-avatar.jpg';
        }
    }
    get userName(): string {
        if (!this.authService.user) return "";
        if (this.authService.user.type === "athlet") {
            const translation = this.authService.user.athlet.translations.find((t) => t.lang_id === this.lang.id);
            return `${translation?.firstname} ${translation?.lastname}`
        } else {
            const translation = this.authService.user.firm.translations.find((t) => t.lang_id === this.lang.id);
            return translation?.name;
        }
    }
    get authorized(): boolean {
        return !!this.authService.authData;
    }
    get category(): string {
        if (!this.authService.user) return "";
        if (this.authService.user.type === "athlet") {
            if (this.authService.user.athlet.sub_type === "Athlet") {
                return this.appService.category.find(e => this.authService.user.athlet.category === e.value).name;
            } else {
                return this.authService.user.athlet.sub_type;
            }
        } else {
            return "Company";
        }
    }

    get my_subscribers(): number {
        return this.authService.user.followers.find(e => e.type === "subscribe").length;
    }

    get my_followers(): number {
        return this.authService.user.followers.find(e => e.type === "follow").length;
    }

    public async ngOnInit(): Promise<void> {
        this.initScroll();
        await this.initPage('home');
        this.route.params.subscribe(p => this.initSEO());

        if (this.deviceDetector.isMobile()) {
            const interval = setInterval(() => {
                this.mobileDialogVisible = true;
                clearInterval(interval);
            }, 10000);
        }
        this.initAthlets();
    }

    protected async initAthlets(): Promise<void> {
        try {
            const chunk = await this.athletRepository.loadChunk(0, 4, "created_at", -1, {});
            this.athlets = chunk.data;
        } catch (err) {
        }
    }

    public closeMobile(): void {
        this.mobileDialogVisible = false;
    }

    nextImage() {
        this.currentImage = (this.currentImage + 1) % this.images.length;
      }
    
    previousImage() {
    this.currentImage = (this.currentImage - 1 + this.images.length) % this.images.length;
    }
}
