import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CPaymentRepository } from "src/app/common/services/repositories/payment.repository";
import { CUserRepository } from "src/app/common/services/repositories/user.repository";
import { INpPaymentCreate } from "src/app/model/dto/np.payment.create.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IPageWords } from "src/app/model/entities/page.interface";
import { IPaysystem } from "src/app/model/entities/paysystem.interface";
import { ITariff } from "src/app/model/entities/tariff.interface";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "subscription",
    templateUrl: "subscription.component.html",
    styleUrls: ["subscription.component.scss"],
})
export class CSubscriptionComponent {
    @Input() pageWords: IPageWords;
    public user: CUser = null;
    public tariff: ITariff = null;
    public paysystem: IPaysystem = null;
    public npCurrencies: string[] = [];
    public npCurrency: string = null;
    public paing: boolean = false;
    public errorDescription: string = null;
    public errorValue: string = null;
    public stripeActive: boolean = false;
    
    constructor(
        protected appService: CAppService,
        protected userRepository: CUserRepository,
        protected paymentRepository: CPaymentRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}
    get isBrowser(): boolean {return this.appService.isBrowser;}
    
    public ngOnInit(): void {
        this.initUser();
        this.initNpCurrencies();
    }

    private async initUser(): Promise<void> {
        try {
            this.user = await this.userRepository.loadMe();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    private async initNpCurrencies(): Promise<void> {
        try {
            this.npCurrencies = await this.paymentRepository.loadNpCurrenciesAll();
            this.npCurrency = this.npCurrencies[0] || null;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onPay(): void {        
        if (!this.tariff || !this.paysystem || (this.paysystem.name === "nowpayments" && !this.npCurrency)) return;
        if (this.paysystem.name === "nowpayments") this.npPay();        
        if (this.paysystem.name === "stripe") this.stripePay();        
    }

    public stripePay(): void {        
        this.stripeActive = true;
    }

    public async npPay(): Promise<void> {
        try {
            this.errorDescription = null;
            this.errorValue = null;
            this.paing = true;
            const dto: INpPaymentCreate = {
                tariff_id: this.tariff.id, 
                lang_slug: this.lang.slug,
                npCurrency: this.npCurrency,
            };
            const url = await this.paymentRepository.npPay(dto);
            this.paing = false;
            document.location = url;
        } catch (err) {
            this.paing = false;

            if (err.statusCode === 409) {
                const minAmount = String(err.error).split("#")[1];
                this.errorDescription = "amount-small";
                this.errorValue = `${minAmount} ${this.npCurrency.toUpperCase()}`;
                return;
            }

            this.appService.notifyError(err);
        }
    }
}