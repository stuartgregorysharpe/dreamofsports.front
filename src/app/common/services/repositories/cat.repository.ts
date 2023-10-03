import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IKeyValue } from 'src/app/model/keyvalue.interface';
import { ICatSimple } from 'src/app/model/entities/cat.simple.interface';
import { ICat } from 'src/app/model/entities/cat.interface';

@Injectable()
export class CCatRepository {    
    constructor(private dataService: CDataService) {}

    public loadAllLeavs(): Promise<IKeyValue<ICatSimple[]>> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .catsAllLeavs()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  

    public loadMenuFoot(): Promise<IKeyValue<ICatSimple[]>> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .catsMenuFoot()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  
    
    public loadAll(): Promise<ICat[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .catsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  
    
    public loadOne(slug: string): Promise<ICat> {
        return new Promise((resolve, reject) => this.dataService
            .catsOne(slug)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode), 
                error: err => reject(err.message),
            }));
    } 

    public addNewSport(addNewSport: string): Promise<ICat> {
        return new Promise((resolve, reject) => this.dataService
            .createNewCat(addNewSport)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode), 
                error: err => reject(err.message),
            }));
    }
}
