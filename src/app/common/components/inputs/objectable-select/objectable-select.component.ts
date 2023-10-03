import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { IMultilangable } from "src/app/model/multilangable.interface";

export interface ISelectable {
    id: number | string | boolean | number[]; 
}

@Component({
    selector: "objectable-select",
    templateUrl: "objectable-select.component.html",
    styleUrls: ["objectable-select.component.scss"],
})
export class CObjectableSelectComponent {
    @Input() public value: any;
    @Input() public items: ISelectable[];
    @Input() public visibleField: string;
    @Input() public valuableField: string;
    @Input() public undefinedable: boolean = false;
    @Input() public undefinedTitle: IMultilangable = {};
    @Input() public nullable: boolean = false;
    @Input() public nullTitle: IMultilangable = {};
    @Input() public multilangable: boolean = false;    
    @Input() public skin: "light" | "dark" = "dark";
    @Output() private valueChange: EventEmitter<any> = new EventEmitter();     
    // iface   
    @ViewChild("btn", {static: false}) private btnElementRef: ElementRef;  
    public active: boolean = false;
    private maxHeight: number = 180;
    private itemHeight: number = 30;
    public top: string = "0";

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get btnElement(): HTMLElement {return this.btnElementRef.nativeElement;}
    
    get height(): number {
        let n = this.items.length;
        this.nullable && n++;
        this.undefinedable && n++;        
        return Math.min(n * this.itemHeight, this.maxHeight);
    }

    get currentValue(): string {
        if (this.value === undefined) return this.undefinedTitle[this.lang.slug];
        if (this.value === null) return this.nullTitle[this.lang.slug];        
        const value = this.items.find(item => this.isEqual(item[this.valuableField], this.value));
        if (!value) return "";
        return this.multilangable ? value[this.visibleField][this.lang.slug] : value[this.visibleField];        
    }

    constructor(private appService: CAppService) {}

    public formatValue(item: any): string {
        const prefix = item._shift || "";
        return this.multilangable ? `${prefix}${item[this.visibleField][this.lang.slug]}` : `${prefix}${item[this.visibleField]}`;
    }

    // может сравнивать скаляры или массивы
    public isEqual(a, b): boolean {
        if (Array.isArray(a) && Array.isArray(b)) {
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }

            return true;            
        }

        return a === b;
    }

    public onSelect(v: any): void {
        const value = v === undefined || v === null ? v : v[this.valuableField];
        this.valueChange.emit(value);
        this.active = false;
    }

    public onActivate(): void {
        const rect = this.btnElement.getBoundingClientRect();
        const btnTop = rect.top;   
        const btnBottom = rect.bottom;  
        // если нижний край блока не влазит, и при приклеивании к верхнему краю кнопки верхний край блока будет вылазить за верхнюю границу экрана меньше, чем нижний при приклеивании к нижнему, то приклеиваем к верхнему краю, иначе - к нижнему        
        this.top = (btnBottom + this.height + 3 > window.innerHeight && btnTop - this.height - 3 > window.innerHeight - (btnBottom + this.height + 3)) ? 
            `${-this.height - 3}px`: 
            "calc(100% + 3px)"; 
        this.active = true;
    }
}