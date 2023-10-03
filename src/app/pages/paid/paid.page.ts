import { Component, OnInit } from "@angular/core";
import { CSimplePage } from "../simple.page";
import { CAppService } from "src/app/common/services/app.service";
import { CPageRepository } from "src/app/common/services/repositories/page.repository";
import { ActivatedRoute, Router } from "@angular/router";
import { CPaymentRepository } from "src/app/common/services/repositories/payment.repository";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
    selector: "paid-page",
    templateUrl: "paid.page.html",    
})
export class CPaidPage extends CSimplePage implements OnInit {
    public paymentOk: boolean = null;

    constructor(
        protected appService: CAppService,
        protected pageRepository: CPageRepository,
        protected paymentRepository: CPaymentRepository,
        protected route: ActivatedRoute,
        protected router: Router,
        protected deviceDetector: DeviceDetectorService
    ) 
    {
        super(appService, pageRepository, route, router, deviceDetector);
    }

    get intent_id(): string {return this.route.snapshot.queryParams["payment_intent"];}

    public async ngOnInit(): Promise<void> {
        this.initScroll(); 
        this.initPaymentStatus();
        await this.initPage('paid');        
        this.route.params.subscribe(p => this.initSEO());  
    }

    private async initPaymentStatus(): Promise<void> {
        try {
            if (!this.intent_id) { // не страйп
                this.paymentOk = true;
                return;
            }

            // для страйпа проверяем статус по параметру из адресной строки
            const statusCode = await this.paymentRepository.stripeCheck(this.intent_id);
            this.paymentOk = (statusCode === 200);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
