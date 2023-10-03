import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { CDatePicker } from "../date-picker";

// этот компонент используется при работе с полем типа timestamp на стороне базы и Date на стороне приложения
@Component({
    selector: "timestamp-picker",
    templateUrl: "../date-picker.html",
    styleUrls: ["../date-picker.scss"],
})
export class CTimestampPickerComponent extends CDatePicker<Date> implements OnChanges {    
    @Input() public useTime: boolean = true;
    public calendarHeight: number = 0;
    
    get formattedDate(): string {
        if (this.value) {
            const day = this.value.getDate();
            const month = this.value.getMonth() + 1;
            const year = this.value.getFullYear();
            const hour = this.value.getHours();
            const minute = this.value.getMinutes();
            return this.beauty ? 
                (this.useTime ? 
                    `${day} ${this.words["date"]?.["monthr-"+month]?.[this.lang.slug]} ${year} ${hour}:${this.appService.twoDigits(minute)}` : 
                    `${day} ${this.words["date"]?.["monthr-"+month]?.[this.lang.slug]} ${year}`) : 
                (this.useTime ? 
                    `${this.appService.twoDigits(day)}.${this.appService.twoDigits(month)}.${year} ${this.appService.twoDigits(hour)}:${this.appService.twoDigits(minute)}` : 
                    `${this.appService.twoDigits(day)}.${this.appService.twoDigits(month)}.${year}`);        
        }
        
        return this.words["date"]?.["any-date"]?.[this.lang.slug];
    }

    public ngOnChanges(): void {
        this.initIface();
        this.initDates();
    }

    protected initIface(): void {
        this.calendarHeight = this.useTime ? 387 : 342;
    }
    
    protected initDates(): void {
        const iniDate = this.value || new Date();
        this.year = this.currentYear = iniDate.getFullYear();
        this.month = this.currentMonth = iniDate.getMonth();
        this.currentDay = iniDate.getDate();
        this.currentHour = this.useTime ? iniDate.getHours() : 0;
        this.currentMinute = this.useTime ? iniDate.getMinutes() : 0;
        this.buildDays();        
    }      

    public onApply(): void {        
        this.valueChange.emit(new Date(this.currentYear, this.currentMonth, this.currentDay, this.currentHour, this.currentMinute));
        this.close();
    }    
}
