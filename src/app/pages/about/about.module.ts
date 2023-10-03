import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CComponentsModule } from "src/app/common/components/components.module";
import { CPipesModule } from "src/app/common/pipes/pipes.module";
import { NgModule } from "@angular/core";
import { CDirectivesModule } from "src/app/common/directives/directives.module";
import { CListEmployeesComponent } from "./components/list-employees/list-employees.component";
import { CAboutPage } from "./page/about.page";

let routes = RouterModule.forChild ([        
    {path:"", component: CAboutPage},  
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        CComponentsModule,
        CPipesModule,
        CDirectivesModule,
        routes,
    ],
    declarations: [
        CAboutPage,
        CListEmployeesComponent,
    ],
    exports: [CAboutPage],
})
export class CAboutModule {}
