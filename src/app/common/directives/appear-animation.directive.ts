import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { Timeout } from "../decorators/timeout";
import { OnlyBrowser } from "../decorators/only-browser";
import { CAppService } from "../services/app.service";

@Directive({selector: "[appear-animation]"})
export class CAppearAnimationDirective implements OnInit, AfterViewInit, OnDestroy {
    @Input() private timeout: number = 0;

    constructor(
        private elementRef: ElementRef,
        private appService: CAppService,
    ) {}

    get element(): HTMLElement {return this.elementRef.nativeElement;}

    public ngOnInit(): void {
        this.animate = this.animate.bind(this);
    }

    @Timeout(1)
    @OnlyBrowser()
    public ngAfterViewInit(): void {
        this.animate();
        this.appService.win.addEventListener("scroll", this.animate);
    }

    public ngOnDestroy(): void {
        this.appService.win.removeEventListener("scroll", this.animate);
    }

    private async animate(): Promise<void> {
        const elementTop = this.element.getBoundingClientRect().top;

        if (elementTop < window.innerHeight) {
            if (!this.element.classList.contains("visible")) {
                await this.appService.pause(this.timeout);
                this.element.classList.add("visible");
            }
        } else {
            if (this.element.classList.contains("visible")) {
                this.element.classList.remove("visible");
            }
        }
    }
}