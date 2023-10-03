import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { ILang } from 'src/app/model/entities/lang.interface';

@Injectable()
export class CLangRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<ILang[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .langsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
