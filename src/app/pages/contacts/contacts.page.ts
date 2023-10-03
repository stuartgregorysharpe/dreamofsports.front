import { Component, OnInit } from "@angular/core";
import { CSimplePage } from "../simple.page";
import { CMessage } from "src/app/model/entities/message";
import { CAppService } from "src/app/common/services/app.service";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { ActivatedRoute, Router } from "@angular/router";
import { CMessageRepository } from "src/app/common/services/repositories/message.repository";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
    selector: "contacts-page",
    templateUrl: "contacts.page.html",
    styleUrls: [
        "contacts.page.scss",
        "../../common/styles/forms.scss"
    ],
})
export class CContactsPage extends CSimplePage implements OnInit {
    public sending: boolean = false;
    public sent: boolean = false;
    public errors: any = {};
    public message: CMessage = new CMessage();

    constructor(
        protected appService: CAppService,
        protected pageRepository: CPageRepository,
        protected messageRepository: CMessageRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService
    ) 
    {
        super(appService, pageRepository, route, router, deviceDetector);
    }

    public async ngOnInit(): Promise<void> {
        this.initScroll(); 
        await this.initPage('contacts');        
        this.route.params.subscribe(p => this.initSEO());  
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validate()) {
                return;
            }

            this.sending = true;
            await this.appService.pause(500);
            const status = await this.messageRepository.create(this.message);
            this.sending = false;

            if (status === 201) {
                this.message = new CMessage();
                this.sent = true;
                await this.appService.pause(3000);
                this.sent = false;
            } else {
                this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
            }

        } catch (err) {
            this.appService.notifyError(err);
            this.sending = false;
        }
    }

    private validate(): boolean {
        let error = false;
        this.message.trim();

        if (!this.message.name.length) {
            this.errors["name"] = "required";
            error = true;
        } else {
            this.errors["name"] = null;
        }

        if (!this.message.email.length) {
            this.errors["email"] = "required";
            error = true;
        } else if (!this.appService.validateEmail(this.message.email)) {
            this.errors["email"] = "email";
            error = true;
        } else {
            this.errors["email"] = null;
        }

        if (!this.message.content.length) {
            this.errors["content"] = "required";
            error = true;
        } else {
            this.errors["content"] = null;
        }

        return !error;
    }
}
