import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IEmployee } from 'src/app/model/entities/employee.interface';

@Injectable()
export class CEmployeeRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<IEmployee[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .employeesAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
