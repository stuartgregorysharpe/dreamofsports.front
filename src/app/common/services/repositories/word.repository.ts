import { Injectable } from '@angular/core';
import { IWords } from 'src/app/model/entities/words.interface';
import { CDataService } from '../data.service';

@Injectable()
export class CWordRepository {    
    constructor(private dataService: CDataService) {}
    
    public loadAll(): Promise<IWords> {
        return new Promise((resolve, reject) =>             
            this.dataService
                .wordsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
