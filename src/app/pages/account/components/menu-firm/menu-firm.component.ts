import { Component } from "@angular/core";
import { cfg } from "src/app/app.config";
import { CMenuAccountComponent } from "../menu-account.component";

@Component({
    selector: "menu-firm",
    templateUrl: "menu-firm.component.html",
})
export class CMenuFirmComponent extends CMenuAccountComponent {
    get userImg(): string {return this.user.firm.img ? `${cfg.supabaseUrl}/images/users/${this.user.firm.img_s}` : null;}
}