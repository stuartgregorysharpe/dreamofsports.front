import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CEmployeeRepository } from "src/app/common/services/repositories/employee.repository";
import { IEmployee } from "src/app/model/entities/employee.interface";
import { ILang } from "src/app/model/entities/lang.interface";

@Component({
    selector: "list-employees",
    templateUrl: "list-employees.component.html",
    styleUrls: ["list-employees.component.scss"],
})
export class CListEmployeesComponent implements OnInit {
    public employees: IEmployee[] = [];

    constructor(
        private appService: CAppService,
        private employeeRepository: CEmployeeRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}

    public ngOnInit(): void {
        this.initEmployees();
    }

    private async initEmployees(): Promise<void> {
        try {
            this.employees = await this.employeeRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    } 
}