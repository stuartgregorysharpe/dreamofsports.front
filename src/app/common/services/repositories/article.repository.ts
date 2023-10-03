import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { CChunk } from "src/app/model/dto/chunk";
import { CArticle } from "src/app/model/entities/article";
import { IGetList } from "src/app/model/dto/getlist.interface";

@Injectable()
export class CArticleRepository {
    constructor(private dataService: CDataService) {}    

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<CArticle>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .articlesChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<CArticle>(res.data.map(d => new CArticle().build(d)), res.elementsQuantity, res.pagesQuantity)) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }

    public loadOne(slug: string): Promise<CArticle> {
        return new Promise((resolve, reject) => this.dataService
            .articlesOne(slug)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve(new CArticle().build(res.data)) : reject(res.statusCode), 
                error: err => reject(err.message),
            }));
    }   
}