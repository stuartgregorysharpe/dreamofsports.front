import { CEntity } from "src/app/model/entities/_entity";
import { CAppService } from "../../services/app.service";
import { AfterViewInit, Directive, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { ILang } from "src/app/model/entities/lang.interface";
import { Timeout } from "../../decorators/timeout";
import { IWords } from "src/app/model/entities/words.interface";

@Directive()
export abstract class CSlider implements AfterViewInit, OnInit {
    // data
    public dataItems: CEntity[] = [];
    // layout
    @ViewChild("container", {static: false}) private containerRef: ElementRef;
    @ViewChild("viewport", {static: false}) private viewportRef: ElementRef;
    public itemWidth: number = 0;
    public itemMargin: number = 0;
    public framesInViewport: number = 1;
    // movement
    protected transition: number = 0.3;
    protected step: number = 0;
    public offset: number = 0;
    public dragging: boolean = false;    
    protected startX: number = 0;
    protected startXOffsetted: number = 0;
    protected startY: number = 0;
    protected prevX: number = 0; 

    constructor(protected appService: CAppService) {}

    get lang(): ILang {return this.appService.lang;}  
    get words(): IWords {return this.appService.words;}
    get container(): HTMLElement {return this.containerRef?.nativeElement;}
    get viewport(): HTMLElement {return this.viewportRef?.nativeElement;}
    get isBrowser(): boolean {return this.appService.isBrowser;}

    /////////////////
    // init
    /////////////////

    public ngOnInit(): void {
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.onFirstTouchMove = this.onFirstTouchMove.bind(this);    
    }

    @Timeout(1)
    public ngAfterViewInit(): void {
        this.initIface();
    }

    protected initIface(): void {
        this.initLayout();
        this.reset();
    }

    protected abstract initData(): Promise<void>;
    protected abstract initLayout(): void;

    @HostListener('window:resize', ['$event'])
    private onResize(event) {
        this.initIface();
    }

    //////////////////
    // movement
    //////////////////

    protected reset(): void {
        this.step = 0;
        this.buildOffset();
    }

    protected buildOffset(): void {
        this.offset = this.step * (this.itemWidth + this.itemMargin);
    }

    public backward(): void {
        if (this.step > 0) {
            this.step--;
            this.buildOffset();
        }
    }

    public forward(): void {
        if (this.step < this.dataItems.length - this.framesInViewport) {
            this.step++;
            this.buildOffset();
        }
    }

    public moveTo(i: number): void {
        this.step = i;
        this.buildOffset();
    }

    public onDragStart (event: TouchEvent | MouseEvent): void {     
        if (this.dataItems.length <= this.framesInViewport) return;
        const o = event instanceof MouseEvent ? event : event.touches[0];
        this.startX = this.lang.dir === "ltr" ? o.clientX : window.innerWidth - o.clientX;
        this.startY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        this.startXOffsetted = this.startX + this.offset;

        if (event instanceof MouseEvent) { // just start dragging    
            this.container.style.transition = `none`;         
            window.addEventListener("mousemove", this.onDragMove, {passive: false});
            window.addEventListener("mouseup", this.onDragEnd);       
        } else { // detect if dragging is more by X than by Y
            window.addEventListener("touchmove", this.onFirstTouchMove);                            
        }          
    }

    protected onFirstTouchMove(event: TouchEvent): void {
        let deltaX = Math.abs(this.startX - event.touches[0].clientX);
        let deltaY = Math.abs(this.startY - event.touches[0].clientY);
        window.removeEventListener("touchmove", this.onFirstTouchMove);

        if (deltaX > deltaY) {      
            this.container.style.transition = `none`;               
            window.addEventListener("touchmove", this.onDragMove, {passive: false});
            window.addEventListener("touchend", this.onDragEnd);  
        }
    } 

    protected onDragMove (event: TouchEvent | MouseEvent): void { 
        event.cancelable && event.preventDefault();    
        const o = event instanceof MouseEvent ? event : event.touches[0];    
        const x = this.lang.dir === "ltr" ? o.clientX : window.innerWidth - o.clientX;
        this.offset = this.startXOffsetted - x;   
        this.prevX = x;     
        this.dragging = Math.abs(x - this.startX) > 3; // detect real movement, not accidental
    }

    protected async onDragEnd (): Promise<void> {                
        window.removeEventListener("mousemove", this.onDragMove);
        window.removeEventListener("touchmove", this.onDragMove);
        window.removeEventListener("mouseup", this.onDragEnd);
        window.removeEventListener("touchend", this.onDragEnd);        
        
        // final move to integer step 
        const step = this.offset / (this.itemWidth+this.itemMargin);
        
        if (this.dragging) { // to prevent final move without container moving
            if (this.prevX < this.startX - 30) {
                this.step = Math.min(Math.ceil(step), this.dataItems.length - this.framesInViewport);
            } else if (this.prevX > this.startX + 30) {
                this.step = Math.max(Math.floor(step), 0);
            } 
        }
        
        this.container.style.transition = `${this.transition}s`;
        this.buildOffset();
        this.dragging = false;
    }  
}