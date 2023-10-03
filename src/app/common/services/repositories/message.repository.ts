import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { CMessage } from "src/app/model/entities/message";

@Injectable()
export class CMessageRepository {    
    constructor(private dataService: CDataService) {}

    public create(dto: CMessage): Promise<number> {
        return new Promise((resolve, reject) => this.dataService
            .messagesCreate(dto)
            .subscribe({
                next: res => resolve(res.statusCode),
                error: err => reject(err.message),
            }));
    }
}
