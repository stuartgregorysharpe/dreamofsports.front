import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IFiles } from 'src/app/model/entities/files.interface';

@Injectable()
export class CFileRepository {
    constructor(private dataService: CDataService) {}
    
    public loadAll(): Promise<IFiles> {
        return new Promise((resolve, reject) => 
            this.dataService
                .filesAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }
}
