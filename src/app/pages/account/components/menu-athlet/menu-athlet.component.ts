import { Component } from "@angular/core";
import { cfg } from "src/app/app.config";
import { CMenuAccountComponent } from "../menu-account.component";

@Component({
    selector: "menu-athlet",
    templateUrl: "menu-athlet.component.html",
})
export class CMenuAthletComponent extends CMenuAccountComponent {    
    get userImg(): string {return this.user.athlet.img ? `${cfg.supabaseUrl}/images/users/${this.user.athlet.img_s}` : null;}
}