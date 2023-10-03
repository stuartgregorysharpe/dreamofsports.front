import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { cfg } from "src/app/app.config";
import { CAppService } from "src/app/common/services/app.service";
import { CChatRepository } from "src/app/common/services/repositories/chat.repository";
import { IFirmOut } from "src/app/model/entities/firm.out.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "firm-short",
    templateUrl: "firm-short.component.html",
    styleUrls: ["firm-short.component.scss"],
})
export class CFirmShortComponent {
    @Input() public firm: IFirmOut;
    @Output() private view: EventEmitter<void> = new EventEmitter();
    public connecting: boolean = false;

    constructor(
        private appService: CAppService,
        private chatRepository: CChatRepository,
        private router: Router,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get langs(): ILang[] {return this.appService.langs;}
    get words(): IWords {return this.appService.words;}
    get img(): string {return `${cfg.supabaseUrl}/images/users/${this.firm.img_s}`;}    

    public onView(): void {
        this.view.emit();
    }   
    
    public async onConnect(): Promise<void> {
        try {
            this.connecting = true;            
            const chat_id = await this.chatRepository.create(this.firm.id);
            this.connecting = false;
            this.router.navigateByUrl(`/${this.lang.slug}/account/messenger/${chat_id}`);
        } catch (err) {
            this.connecting = false;
            this.onConnectFailed(err); 
        }
    }

    private onConnectFailed(err: any): void {
        if (err === 401) {
            this.appService.popupOnlypaidActive = true;
        }

        if (err === 4011) {
            this.appService.popupYoubannedActive = true;
        }

        if (err === 4012) {
            this.appService.popupUserbannedId = this.firm.id;
            this.appService.popupUserbannedActive = true;            
        }
    }
}
