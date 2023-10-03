import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IKeyValue } from 'src/app/model/keyvalue.interface';
import { ICountrySimple } from 'src/app/model/entities/country.simple.interface';

@Injectable()
export class CCountryRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<IKeyValue<ICountrySimple[]>> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .countriesAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
