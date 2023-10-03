import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { ITariff } from 'src/app/model/entities/tariff.interface';

@Injectable()
export class CTariffRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<ITariff[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .tariffsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
