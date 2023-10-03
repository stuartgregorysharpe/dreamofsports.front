import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { CChunk } from "src/app/model/dto/chunk";
import { IGetList } from "src/app/model/dto/getlist.interface";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";

@Injectable()
export class CAthletRepository {
    constructor(private dataService: CDataService) {}    

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<IAthletOut>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .athletsChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<IAthletOut>(res.data, res.elementsQuantity, res.pagesQuantity)) : reject(res.statusCode), 
                    error: err => reject(err.message)
                }));
    }    

    public loadOne(id: number): Promise<IAthletOut> {
        return new Promise((resolve, reject) => 
            this.dataService
                .athletsOne(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode), 
                    error: err => reject(err.message),
                }));
    } 

    public loadFavoritesChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<IAthletOut>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .athletsFavoritesChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<IAthletOut>(res.data, res.elementsQuantity, res.pagesQuantity)) : reject(res.statusCode), 
                    error: err => reject(err.message)
                }));
    }   
    
    public favoritesCreate(favorite_id: number): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .athletsFavoritesCreate(favorite_id)
                .subscribe({
                    next: res => resolve(res.statusCode),
                    error: err => reject(err.message),
                }));
    }

    public favoritesDelete(favorite_id: number): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .athletsFavoritesDelete(favorite_id)
                .subscribe({
                    next: res => resolve(res.statusCode),
                    error: err => reject(err.message),
                }));
    }
}