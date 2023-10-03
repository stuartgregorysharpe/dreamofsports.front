import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { ILang } from "src/app/model/entities/lang.interface";
import { CUserEmail } from "src/app/model/entities/user.email";
import { CUserLink } from "src/app/model/entities/user.link";
import { CUserPhone } from "src/app/model/entities/user.phone";
import { CUserSocial } from "src/app/model/entities/user.social";
import { IContact } from "./contact.interface";
import { ISocial } from "src/app/model/entities/social.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "contacts",
    templateUrl: "contacts.component.html",
    styleUrls: ["contacts.component.scss"],
})
export class CContactsComponent {
    @Input() public contacts: IContact[];
    @Input() public type: "phones" | "emails" | "links" | "socials";
    @Input() public errors: string[] = [];    
    @Input() public socials: ISocial[] = [];
    private contactMap = {
        "phones": CUserPhone,
        "emails": CUserEmail,
        "links": CUserLink,
        "socials": CUserSocial,
    };

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get exhausted(): boolean {return this.contacts.length >= parseInt(this.appService.settings[`limit-${this.type}`]);} 

    public onDelete(i: number): void {
        this.contacts.splice(i, 1);
    }

    public onAdd(): void {
        if (!this.exhausted) {
            const pos = this.contacts.length ? Math.max(...this.contacts.map(c => c.pos)) + 1 : 0;
            const contact = new this.contactMap[this.type]().init(pos);
            this.contacts.push(contact);
        }        
    }
}