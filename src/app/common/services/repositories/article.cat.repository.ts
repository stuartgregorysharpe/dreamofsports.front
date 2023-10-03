import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IArticleCat } from "src/app/model/entities/article.cat.interface";

@Injectable()
export class CArticleCatRepository {
    constructor(private dataService: CDataService) {}    

    public loadAll(): Promise<IArticleCat[]> {
        return new Promise((resolve, reject) => 
            this.dataService
                .articleCatsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }

    public loadOne(slug: string): Promise<IArticleCat> {
        return new Promise((resolve, reject) => this.dataService
            .articleCatsOne(slug)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode), 
                error: err => reject(err.message),
            }));
    }   
}