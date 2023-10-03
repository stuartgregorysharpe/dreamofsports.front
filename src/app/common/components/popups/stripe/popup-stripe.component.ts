import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CPopupComponent } from "../popup.component";
import { ITariff } from "src/app/model/entities/tariff.interface";
import { IPaysystem } from "src/app/model/entities/paysystem.interface";
import { CAppService } from "src/app/common/services/app.service";
import { CPaymentRepository } from "src/app/common/services/repositories/payment.repository";
import { Appearance, Stripe, StripeConstructorOptions, StripeElements, StripePaymentElementOptions, loadStripe } from '@stripe/stripe-js';

@Component({
    selector: "popup-stripe",
    templateUrl: "popup-stripe.component.html",
    styleUrls: [
        "../popup.component.scss",
        "popup-stripe.component.scss",
    ],
})
export class CPopupStripeComponent extends CPopupComponent implements OnChanges {
    @Input() paysystem: IPaysystem = null;
    @Input() tariff: ITariff = null;
    private stripe: Stripe = null;
    private elements: StripeElements = null;
    private secret: string = null;
    private appearance: Appearance = {theme: "stripe", variables: {colorWarning: "#f70909", colorDanger: "#f70909", colorPrimary: "#f70909", colorText: "#ffffff", colorBackground: "#7b7b7b"}};
    public paying: boolean = false;

    constructor(
        protected appService: CAppService,
        protected paymentRepository: CPaymentRepository,
    ) 
    {
        super(appService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["active"]?.currentValue) {
            this.initStripe();
        }
    }

    private async initStripe(): Promise<void> {
        try {
            const key = this.paysystem.params.find(p => p.name === "public-key")?.value;
            if (!key) return;
            this.stripe = await loadStripe(key, {locale: this.lang.slug as StripeConstructorOptions["locale"]});
            this.secret = await this.paymentRepository.stripePrepare(this.tariff.id);
            this.elements = this.stripe.elements({clientSecret: this.secret, appearance: this.appearance});            
            const paymentElementOptions: StripePaymentElementOptions = {layout: "tabs"};
            const paymentElement = this.elements.create("payment", paymentElementOptions);
            paymentElement.mount("#stripe-payment");
        } catch (err) {
            this.appService.notifyError(err);
        }        
    }

    public async onSubmit(): Promise<void> {
        try {
            this.paying = true;
            await this.paymentRepository.stripePay({tariff_id: this.tariff.id, secret: this.secret});
            const { error } = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    return_url: `${window.location.origin}/${this.lang.slug}/paid`,
                },
            });            
            // This point will only be reached if there is an immediate error when confirming the payment. Otherwise, your customer will be redirected to your `return_url`.
            this.paying = false;            
            !["card_error", "validation_error"].includes(error.type) && this.appService.notifyError(error.message); // unexpected error      
        } catch (err) {
            this.appService.notifyError(err);
        }        
    }
}
