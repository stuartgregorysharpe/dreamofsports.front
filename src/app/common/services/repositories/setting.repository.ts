import { Injectable } from '@angular/core';
import { ISettings } from 'src/app/model/entities/settings.interface';
import { CDataService } from '../data.service';

@Injectable()
export class CSettingRepository {
    constructor(private dataService: CDataService) {}
    
    public loadAll(): Promise<ISettings> {
        return new Promise((resolve, reject) => 
            this.dataService
                .settingsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }
}
