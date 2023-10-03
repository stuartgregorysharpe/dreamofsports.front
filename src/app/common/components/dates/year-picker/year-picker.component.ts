import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "year-picker",
    templateUrl: "year-picker.component.html",
    styleUrls: ["year-picker.component.scss"],
})
export class CYearPickerComponent implements OnChanges {
    @Input() public value: number;
    @Input() public active: boolean;
    @Input() public skin: "medium" | "dark" = "dark";
    @Output() private valueChange: EventEmitter<number> = new EventEmitter();
    @Output() private activeChange: EventEmitter<boolean> = new EventEmitter();
    // data
    public current: number = 0;
    public from: number = 0;
    public years: number[] = [];
    public now: number = 0;
    // iface
    private interval: number = null;
    private timeout: number = null; 

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get to(): number {return this.from + 9;}

    public ngOnChanges(changes: SimpleChanges): void {
        this.current = this.value;
        this.now = new Date().getFullYear();
        this.from = parseInt(`${Math.floor(this.value / 10).toString()}0`);
        this.buildYears();
    }

    private buildYears(): void {
        this.years = this.appService.range(this.from, this.to);        
    }

    public onClose(): void {
        this.activeChange.emit(false);
    }

    public onBack(): void {
        this.back();
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => this.back(), 100), 1000);
    }

    public onForward(): void {
        this.forward();
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => this.forward(), 100), 1000);
    }

    private back(): void {
        this.from >= 1010 && (this.from -= 10);
        this.buildYears();
    }

    private forward(): void {
        this.from <= 9980 && (this.from += 10);
        this.buildYears();
    }

    public onApply(): void {
        this.valueChange.emit(this.current);
        this.onClose();
    }

    public onSelect(year: number): void {
        this.current = year;
    }
    
    @HostListener('window:mouseup')
    public onMouseUp(): void {        
        this.timeout && window.clearTimeout(this.timeout);
        this.interval && window.clearInterval(this.interval);        
    }
}