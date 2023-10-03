import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { CChunk } from "src/app/model/dto/chunk";
import { IGetList } from "src/app/model/dto/getlist.interface";
import { IFirmOut } from "src/app/model/entities/firm.out.interface";

@Injectable()
export class CFirmRepository {
    constructor(private dataService: CDataService) {}    

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<IFirmOut>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .firmsChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<IFirmOut>(res.data, res.elementsQuantity, res.pagesQuantity)) : reject(res.statusCode), 
                    error: err => reject(err.message)
                }));
    }    

    public loadOne(id: number): Promise<IFirmOut> {
        return new Promise((resolve, reject) => 
            this.dataService
                .firmsOne(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode), 
                    error: err => reject(err.message),
                }));
    }
}
