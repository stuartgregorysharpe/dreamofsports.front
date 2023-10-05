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

    @ViewChild('carouselText') carouselText: ElementRef;
  
    originalTopPosition: number;
    isInOriginalPosition = true;

    public images = [
        'https://img001.prntscr.com/file/img001/o8CtndWTS9uYGGjXDEdHyQ.png',
        'https://img001.prntscr.com/file/img001/5XPavDlyTaOhMTq9k2PQ4Q.png',
        'https://img001.prntscr.com/file/img001/3lVefw4QRimC6pCs7Aquzg.png',
        'https://img001.prntscr.com/file/img001/P47ABTeZQbKrHcmsebp4Vg.png',
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
    
    ngAfterViewInit(): void {
        // store the initial top position
        this.originalTopPosition = this.carouselText.nativeElement.getBoundingClientRect().top;
        
        // initial check
        this.checkPosition();
    
        // adding the scroll event listener
        window.addEventListener('scroll', this.checkPosition.bind(this));
      }
    
      checkPosition(): void {
        const currentTopPosition = this.carouselText.nativeElement.getBoundingClientRect().top;
        this.isInOriginalPosition = this.originalTopPosition === currentTopPosition;
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

    public previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
    }

    public nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.images.length;
    }
}
