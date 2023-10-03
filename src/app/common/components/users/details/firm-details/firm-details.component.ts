import { Component, Input } from "@angular/core";
import { IFirmOut } from "src/app/model/entities/firm.out.interface";
import { CUserDetailsComponent } from "../user-details.component";

@Component({
    selector: "firm-details",
    templateUrl: "firm-details.component.html",
    styleUrls: ["../user-details.component.scss"],
})
export class CFirmDetailsComponent extends CUserDetailsComponent {
    @Input() public firm: IFirmOut;    
    public chapter: "contacts" | "about" | "images" | "videos" | "others" = "contacts";
       
    get h1(): string {return `${this.firm.name[this.lang.slug] || this.firm.name[this.langs[0].slug]}`;} 

    get hasAbout(): boolean {
        for (let l of this.langs) {
            if (this.firm.about[l.slug]) {
                return true;
            }
        }
        return false;
    }
}
