import { AfterViewInit, Directive, ElementRef, Input, OnInit } from "@angular/core";
import { CAppService } from "../services/app.service";

interface ISortable {
    pos: number;
}

@Directive({selector: "[sortable]"})
export class CSortableDirective implements OnInit, AfterViewInit {
    @Input() public data: ISortable[];
    @Input() public handleClass: string;
    @Input() public itemClass: string;
    private items: HTMLElement[] = [];    
    private current: HTMLElement = null;
    private copy: HTMLElement = null;
    private startX: number = null;
    private startY: number = null;

    constructor(
        private containerRef: ElementRef,
        private appService: CAppService,
    ) {}

    get container(): HTMLElement {return this.containerRef.nativeElement;}
    
    ////////////////////
    // init
    ////////////////////

    public ngOnInit(): void {
        this.initItems = this.initItems.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    public ngAfterViewInit(): void {
        this.initItems();
        this.container.addEventListener("DOMNodeInserted", this.initItems); // когда вставили новый элемент - оживляем его
    }

    private initItems(): void {
        this.items = Array.from(this.container.children) as HTMLElement[];
        this.items.forEach(item => {
            item.removeEventListener("mousedown", this.onDragStart);
            item.removeEventListener("touchstart", this.onDragStart);
            item.addEventListener("mousedown", this.onDragStart);
            item.addEventListener("touchstart", this.onDragStart);
        });        
    }

    ////////////////////
    // events
    ////////////////////

    private onDragStart(event: MouseEvent | TouchEvent): void {  
        if ((event.target as HTMLElement).classList.contains("add")) return; // в конце списка допускается кнопка add, ее не двигаем :-)
        if (!(event.target as HTMLElement).classList.contains(this.handleClass)) return; // двигаем только за handle
        if (event instanceof MouseEvent && event.button !== 0) return;
        this.initDOM(event);
        this.initEvents(event);
    }

    private onDragMove (event: TouchEvent | MouseEvent): void {     
        event.cancelable && event.preventDefault(); 
        this.moveCopy(event);    
        this.moveItems();    
    }

    private async onDragEnd(): Promise<void> {                
        window.removeEventListener("mousemove", this.onDragMove);
        window.removeEventListener("touchmove", this.onDragMove);
        window.removeEventListener("mouseup", this.onDragEnd);
        window.removeEventListener("touchend", this.onDragEnd);   
        this.copy.remove();   
        this.current.classList.remove("current");
        this.items.forEach(item => item.classList.remove("active"));
    }

    ///////////////////////////
    // utils - start movement
    ///////////////////////////

    private initDOM(event: MouseEvent | TouchEvent): void {            
        this.current = this.handleClass === this.itemClass ? 
            event.target as HTMLElement : 
            this.appService.getParents(event.target as HTMLElement).find(p => p.classList.contains(this.itemClass));
        const rect = this.current.getBoundingClientRect();
        const x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const y = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        this.startX = x - rect.left;
        this.startY = y - rect.top;
        this.copy = this.current.cloneNode(true) as HTMLElement;
        this.appService.cloneStyles(this.current, this.copy);
        this.copy.style.left = `${rect.left}px`;
        this.copy.style.top = `${rect.top}px`;
        this.copy.style.position = "fixed";
        this.copy.style.zIndex = "1000";
        window.document.body.append(this.copy);
        this.current.classList.add("current");
    }

    private initEvents(event: MouseEvent | TouchEvent): void {
        if (event instanceof MouseEvent) {    
            window.addEventListener("mousemove", this.onDragMove, {passive: false});
            window.addEventListener("mouseup", this.onDragEnd);       
        } else { 
            window.addEventListener("touchmove", this.onDragMove, {passive: false});
            window.addEventListener("touchend", this.onDragEnd);                            
        }   
    }

    ///////////////////////////
    // utils - movement
    ///////////////////////////

    private moveCopy(event: MouseEvent | TouchEvent): void {
        const x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const y = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        const nextX = x - this.startX;   
        const nextY = y - this.startY;
        this.copy.style.left = `${nextX}px`;
        this.copy.style.top = `${nextY}px`;   
    }

    private moveItems(): void {
        this.items.forEach(item => item.classList.remove("active"));
        const overlappedItems = this.items.filter(item => this.appService.isOverlapped(item, this.copy));
        const itemToSwap = this.getItemToSwap(overlappedItems);
        
        if (itemToSwap && !itemToSwap.classList.contains("add")) { // в конце списка допускается кнопка add, ее не двигаем :-)
            const currentIndex = this.items.indexOf(this.current);
            const itemToSwapIndex = this.items.indexOf(itemToSwap);

            if (currentIndex !== itemToSwapIndex) {
                const f = currentIndex < itemToSwapIndex ? "after" : "before";
                itemToSwap[f](this.current);
                this.items = Array.from(this.container.children) as HTMLElement[]; // rebuild array after DOM rebuild
                this.sortData(currentIndex, itemToSwapIndex);
            }            
        }
    }    

    private getItemToSwap(overlappedItems: HTMLElement[]): HTMLElement {
        let itemToSwap: HTMLElement = null;
        let maxOverlapSquare = 0;

        for (let item of overlappedItems) {
            const s = this.appService.overlapSquare(item, this.copy);

            if (s > maxOverlapSquare) {
                maxOverlapSquare = s;
                itemToSwap = item;
            }
        }

        return itemToSwap;
    }

    private sortData(from: number, to: number): void {
        this.appService.moveArrayElement(this.data, from, to);

        for (let i = 0; i < this.data.length; i++) {
            this.data[i].pos = i;
        }
    }
}