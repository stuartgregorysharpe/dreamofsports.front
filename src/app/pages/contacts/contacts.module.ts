import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CComponentsModule } from "src/app/common/components/components.module";
import { CPipesModule } from "src/app/common/pipes/pipes.module";
import { NgModule } from "@angular/core";
import { CDirectivesModule } from "src/app/common/directives/directives.module";
import { CContactsPage } from "./contacts.page";
import { FormsModule } from "@angular/forms";

let routes = RouterModule.forChild ([        
    {path:"", component: CContactsPage},  
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        CComponentsModule,
        CPipesModule,
        CDirectivesModule,
        routes,
    ],
    declarations: [CContactsPage],
    exports: [CContactsPage],
})
export class CContactsModule {}
