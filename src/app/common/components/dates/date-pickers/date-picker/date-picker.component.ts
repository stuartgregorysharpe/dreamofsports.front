import { Component, OnChanges, OnInit } from "@angular/core";
import { CDatePicker } from "../date-picker";

// этот компонент используется при работе с полем типа date на стороне базы и string на стороне приложения
@Component({
    selector: "date-picker",
    templateUrl: "../date-picker.html",
    styleUrls: ["../date-picker.scss"],
})
export class CDatePickerComponent extends CDatePicker<string> implements OnChanges {    
    public useTime: boolean = false;
    public calendarHeight: number = 342;
    
    get formattedDate(): string {
        if (this.value) {
            const dateParts = this.value.split("-");
            const day = parseInt(dateParts[2]);
            const month = parseInt(dateParts[1]);
            const year = parseInt(dateParts[0]);
            return this.beauty ? 
                `${day} ${this.words['data']?.['monthr-'+month]?.[this.lang.slug]} ${year}` : 
                `${this.appService.twoDigits(day)}.${this.appService.twoDigits(month)}.${year}`;      
        }
        
        return this.words['date']?.['any-date']?.[this.lang.slug];
    }

    public ngOnChanges(): void {
        this.initDates();
    }
    
    protected initDates(): void {
        const iniValue = this.value || this.appService.mysqlDate(new Date());
        const dateParts = iniValue.split("-");
        this.currentDay = parseInt(dateParts[2]);
        this.month = this.currentMonth = parseInt(dateParts[1]) - 1; // месяцы удобнее с нуля при построении календаря
        this.year = this.currentYear = parseInt(dateParts[0]);this.buildDays();        
    }

    public onApply(): void {        
        this.valueChange.emit(`${this.currentYear}-${this.appService.twoDigits(this.currentMonth+1)}-${this.appService.twoDigits(this.currentDay)}`);
        this.close();
    }
}
