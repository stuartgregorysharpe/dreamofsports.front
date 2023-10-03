import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Component({
    selector: "time-picker",
    templateUrl: "time-picker.component.html",
    styleUrls: ["time-picker.component.scss"],
})
export class CTimePickerComponent {
    @Input() public hour: number = 0;
    @Input() public minute: number = 0;
    @Output() private hourChange: EventEmitter<number> =  new EventEmitter();
    @Output() private minuteChange: EventEmitter<number> =  new EventEmitter();
    private interval: number = null;
    private timeout: number = null;

    public async onBack(param: string): Promise<void> {
        this.back(param);
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => this.back(param), 100), 1000);
    }

    public async onForward(param: string): Promise<void> {
        this.forward(param);
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => this.forward(param), 100), 1000);
    }

    private back(param: string): void {
        if (param === "hour") {
            const hour = this.hour ? this.hour - 1 : 23;
            this.hourChange.emit(hour);
        }
        if (param === "minute") {
            const minute = this.minute ? this.minute - 1 : 59;
            this.minuteChange.emit(minute);
        }
    }

    private forward(param: string): void {
        if (param === "hour") {
            const hour = this.hour < 23 ? this.hour + 1 : 0;
            this.hourChange.emit(hour);
        }
        if (param === "minute") {
            const minute = this.minute < 59 ? this.minute + 1 : 0;
            this.minuteChange.emit(minute);
        }
    }

    @HostListener('window:mouseup')
    public onMouseUp(): void {        
        this.timeout && window.clearTimeout(this.timeout);
        this.interval && window.clearInterval(this.interval);        
    }
}