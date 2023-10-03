import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IComplaintCreate } from "src/app/model/dto/complaint.create.interface";

@Injectable()
export class CComplaintRepository {
    constructor(private dataService: CDataService) {}

    public create(dto: IComplaintCreate): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .complaintsCreate(dto)
                .subscribe({
                    next: res => resolve(res.statusCode),
                    error: err => reject(err.message),
                }));
    }
}