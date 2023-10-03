import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { CChatRepository } from "src/app/common/services/repositories/chat.repository";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";
import { CUserDetailsComponent } from "../user-details.component";

@Component({
    selector: "athlet-details",
    templateUrl: "athlet-details.component.html",
    styleUrls: ["../user-details.component.scss"],
})
export class CAthletDetailsComponent extends CUserDetailsComponent {
    @Input() public athlet: IAthletOut;
    @Input() public favoriteMode: boolean = false;
    public chapter: "contacts" | "bio" | "rewards" | "images" | "videos" | "others" = "contacts";
    public favoriting: boolean = false;
    public favorited: boolean = false;
    public connecting: boolean = false;

    constructor(
        protected appService: CAppService,
        protected authService: CAuthService,
        protected athletRepository: CAthletRepository,
        protected chatRepository: CChatRepository,
        protected router: Router,
    ) 
    {
        super(appService, authService);
    }

    get favoritable(): boolean {return this.authService.authData && this.authService.authData.type === "firm" && !this.athlet.favorite;}
    get contactable(): boolean {return this.authService.authData?.id !== this.athlet.id;}
    get h1(): string {return `${this.athlet.firstname[this.lang.slug] || this.athlet.firstname[this.langs[0].slug]} ${this.athlet.lastname[this.lang.slug] || this.athlet.lastname[this.langs[0].slug]}`;} 

    get hasBio(): boolean {
        for (let l of this.langs) {
            if (this.athlet.bio[l.slug]) {
                return true;
            }
        }
        return false;
    }

    public async onFavorite(): Promise<void> {
        try {
            this.favoriting = true;
            const status = await this.athletRepository.favoritesCreate(this.athlet.id);
            this.favoriting = false;

            if (status === 201) {
                this.favorited = true;
                await this.appService.pause(3000);
                this.athlet.favorite = true;
                this.favorited = false;
                return;
            } 
            
            if (status === 401) {
                this.appService.popupOnlypaidActive = true;
                return;
            } 
                
            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);            
        } catch (err) {
            this.appService.notifyError(err);
            this.favoriting = false;
        }
    }

    public async onConnect(): Promise<void> {
        try {
            this.connecting = true;            
            const chat_id = await this.chatRepository.create(this.athlet.id);
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
            this.appService.popupUserbannedId = this.athlet.id;
            this.appService.popupUserbannedActive = true;            
        }
    }
}