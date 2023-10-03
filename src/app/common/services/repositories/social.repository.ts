import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { ISocial } from 'src/app/model/entities/social.interface';

@Injectable()
export class CSocialRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<ISocial[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .socialsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
