import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { IDay } from "./day.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Directive()
export abstract class CDatePicker<T> {
    @Input() public value: T = null;
    @Output() protected valueChange: EventEmitter<T> = new EventEmitter();   
    @Input() public beauty: boolean = false;
    @Input() public resetable: boolean = false;
    @Input() public resetvalue: undefined | null = undefined; // какое значение ставим при сбросе
    @Input() public skin: "medium" | "dark" = "dark";
    @ViewChild("btnelement", {static: false}) protected btnElementRef: ElementRef;
    public abstract useTime: boolean; 
    // dates - will select
    public days: IDay[] = []; 
    public year: number = 0; 
    public month: number = 0;
    // dates - now selected
    public currentYear: number = 0; 
    public currentMonth: number = 0; 
    public currentDay: number = 0;    
    public currentHour: number = 0;
    public currentMinute: number = 0;
    // iface        
    public calendarActive: boolean = false;
    public yearPickerActive: boolean = false;
    public abstract calendarHeight: number;
    public calendarWidth: number = 252;
    public calendarTop: string = "";    
    public calendarLeft: string = ""; 
    protected interval: number = null;
    protected timeout: number = null; 

    constructor(protected appService: CAppService) {}
    
    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get btnElement(): HTMLElement {return this.btnElementRef.nativeElement;}  
    abstract get formattedDate(): string;

    protected buildDays(): void {
        const now = new Date();
        const firstDayOfMonth = this.appService.firstDayOfWeekInMonth(this.month, this.year);
        const daysInMonth = this.appService.daysInMonth(this.month, this.year);      
        this.days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            const day: IDay = {hidden: true};
            this.days.push(day);
        }

        for (let j: number = 0; j < daysInMonth; j++) {
            const day: IDay = {n: j+1};
            day.current = (j + 1 === this.currentDay && this.month === this.currentMonth && this.year === this.currentYear);            
            const index: number = firstDayOfMonth + j + 1;
            day.holiday = (!(index % 7) || !((index+1) % 7)); 
            day.now = (j + 1 === now.getDate() && this.month === now.getMonth() && this.year === now.getFullYear());         
            this.days.push(day);                            
        }
    }    

    public onMonthBack(): void {
        this.monthBack();
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => this.monthBack(), 100), 1000);
    }

    public onMonthForward(): void {
        this.monthForward();
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => this.monthForward(), 100), 1000);
    }

    public monthBack(): void {
        if (this.month === 0) {
            if (this.year > 1000) {
                this.month = 11;
                this.year--;
            }            
        } else {
            this.month--;
        }

        this.buildDays();
    }

    public monthForward(): void {
        if (this.month === 11) {
            if (this.year < 9999) {
                this.month = 0;
                this.year++;
            }            
        } else {
            this.month++;
        }

        this.buildDays();
    }       

    public onSetDate(day: IDay): void {
        this.currentDay = day.n;
        this.currentMonth = this.month;
        this.currentYear = this.year;        
        this.buildDays();
    }  

    public onReset(event: Event): void {
        event.stopPropagation();
        this.valueChange.emit(this.resetvalue);
    }
    
    public onActivate(): void {
        const btnLeft = this.btnElement.getBoundingClientRect().left; 
        const btnRight = this.btnElement.getBoundingClientRect().right; 
        const btnTop = this.btnElement.getBoundingClientRect().top;   
        const btnBottom = this.btnElement.getBoundingClientRect().bottom; 
        this.calendarLeft = this.lang.dir === "ltr" ? 
            // если правый край панели не влазит, и при приклеивании к правому краю кнопки левый край блока будет вылазить меньше, чем правый при приклеивании к левому, то клеим к правому, иначе - к левому
            ((btnLeft + this.calendarWidth > window.innerWidth && btnRight - this.calendarWidth > window.innerWidth - (btnLeft + this.calendarWidth)) ? 
                `${btnRight - this.calendarWidth}px` : 
                `${btnLeft}px`) :
            // для RTL наоборот
            ((btnRight - this.calendarWidth < 0 && btnLeft + this.calendarWidth > this.calendarWidth - btnRight) ? 
                `${btnLeft}px` : 
                `${btnRight - this.calendarWidth}px`);
        // аналогично с высотой и нижними/верхними краями
        this.calendarTop = (btnBottom + this.calendarHeight + 5 > window.innerHeight && btnTop - this.calendarHeight - 5 > window.innerHeight - (btnBottom + this.calendarHeight + 5)) ? 
            `${btnTop - this.calendarHeight - 5}px` : 
            `${btnBottom + 5}px`;        
        this.calendarActive = true;
    }    

    @HostListener('window:resize')
    public onResize(): void {        
        this.close();
    }

    @HostListener('window:mouseup')
    public onMouseUp(): void {        
        this.timeout && window.clearTimeout(this.timeout);
        this.interval && window.clearInterval(this.interval);        
    }

    public close(): void {
        this.calendarActive && (this.calendarActive = false);
        this.yearPickerActive && (this.yearPickerActive = false);
    }
}