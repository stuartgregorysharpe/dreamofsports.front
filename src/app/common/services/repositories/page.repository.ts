import { Injectable } from '@angular/core';
import { IPage } from 'src/app/model/entities/page.interface';
import { CDataService } from '../data.service';

@Injectable()
export class CPageRepository {
    constructor(private dataService: CDataService) {}    

    public loadMenuMain(): Promise<IPage[]> {
        return new Promise((resolve, reject) => 
            this.dataService
                .pagesMenuMain()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  

    public loadMenuFoot(): Promise<IPage[]> {
        return new Promise((resolve, reject) => 
            this.dataService
                .pagesMenuFoot()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  

    public loadOne(slug: string): Promise<IPage> {
        return new Promise((resolve, reject) => this.dataService
            .pagesOne(slug)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode), 
                error: err => reject(err.message),
            }));
    }    
}
