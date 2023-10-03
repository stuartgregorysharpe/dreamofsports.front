import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IPaysystem } from 'src/app/model/entities/paysystem.interface';

@Injectable()
export class CPaysystemRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<IPaysystem[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .paysystemsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
