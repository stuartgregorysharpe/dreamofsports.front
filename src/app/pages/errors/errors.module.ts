import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CError404Page } from "./404/error404.page";
import { CError401Page } from "./401/error401.page";
import { CPipesModule } from "src/app/common/pipes/pipes.module";

let routes = RouterModule.forChild ([            
	{path: "404", component: CError404Page},	
	{path: "401", component: CError401Page},	
]);

@NgModule({	
    imports: [	
		CommonModule,
		RouterModule,   
		CPipesModule,
        routes,		
	],
	declarations: [
		CError404Page,
		CError401Page,
	],    		    
})
export class CErrorsModule {}