import { Component, Input } from "@angular/core";
import { cfg } from "src/app/app.config";
import { IUserOther } from "src/app/model/entities/user.other.interface";

@Component({
    selector: "user-others",
    templateUrl: "user-others.component.html",
    styleUrls: ["user-others.component.scss"],
})
export class CUserOthersComponent {
    @Input() public data: IUserOther[];
    get supabaseUrl(): string {return cfg.supabaseUrl;}    
}