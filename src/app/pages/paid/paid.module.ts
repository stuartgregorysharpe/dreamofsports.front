import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CPaidPage } from "./paid.page";
import { CPipesModule } from "src/app/common/pipes/pipes.module";

let routes = RouterModule.forChild ([        
    {path:"", component: CPaidPage},  
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,    
        CPipesModule,
        routes,
    ],
    declarations: [CPaidPage],
    exports: [CPaidPage],
})
export class CPaidModule {}
