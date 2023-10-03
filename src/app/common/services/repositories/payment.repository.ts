import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IStripePaymentCreate } from 'src/app/model/dto/stripe.payment.create.interface';
import { INpPaymentCreate } from 'src/app/model/dto/np.payment.create.interface';

@Injectable()
export class CPaymentRepository {    
    constructor(private dataService: CDataService) {}

    public stripePrepare(tariff_id: number): Promise<string> {
        return new Promise((resolve, reject) => 
            this.dataService
                .paymentsStripePrepare(tariff_id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error),
                    error: err => reject(err.message),
                }));
    }

    public stripePay(dto: IStripePaymentCreate): Promise<void> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .paymentsStripePay(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  

    public stripeCheck(intent_id: string): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .paymentsStripeCheck(intent_id)
                .subscribe({
                    next: res => resolve(res.statusCode),
                    error: err => reject(err.message),
                })
        );
    }

    public npPay(dto: INpPaymentCreate): Promise<string> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .paymentsNpPay(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res), 
                    error: err => reject(err.message),
                }));
    }  

    public loadNpCurrenciesAll(): Promise<string[]> {
        return new Promise((resolve, reject) => 
            this.dataService
                .paymentsNpCurrenciesAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }
}
