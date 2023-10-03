import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IChatMessageCreate } from "src/app/model/dto/chat.message.create.interface";
import { IGetList } from "src/app/model/dto/getlist.interface";
import { CChunk } from "src/app/model/dto/chunk";
import { CChatMessage } from "src/app/model/entities/chat.message";

@Injectable()
export class CChatMessageRepository {
    constructor(private dataService: CDataService) {}

    public create(dto: IChatMessageCreate): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .chatMessagesCreate(dto)
                .subscribe({
                    next: res => res.statusCode === 201 ? resolve() : reject(res.error),
                    error: err => reject(err.message),
                }));
    }
    
    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<CChatMessage>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .chatMessagesChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<CChatMessage>(res.data.map(d => new CChatMessage().build(d)), res.elementsQuantity, res.pagesQuantity)) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }
}