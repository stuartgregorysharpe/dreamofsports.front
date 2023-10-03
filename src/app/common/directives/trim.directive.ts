import { Directive, ElementRef, HostListener, Renderer2 } from "@angular/core";
import { NgModel } from "@angular/forms";

@Directive({
    selector: 'input[type=text], input[type=email], input[type=password]',
})
export class CTrimDirective {
    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private ngModel: NgModel
    ) {}
  
    @HostListener("blur")
    public onBlur() {
        this.trim();
    }

    @HostListener("keydown", ["$event"])
    public onKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.trim();
        }
    }

    private trim(): void {
        let value = this.ngModel.model;

        if(value) {
            value = value.trim();
            this.renderer.setProperty(this.elementRef.nativeElement, "value", value);
            this.renderer.setAttribute(this.elementRef.nativeElement, "value", value);
            this.ngModel.update.emit(value)
        } else {
            this.renderer.setProperty(this.elementRef.nativeElement, "value", null);
            this.renderer.setAttribute(this.elementRef.nativeElement, "value", null);
            this.ngModel.update.emit("");
        }
    }
}
