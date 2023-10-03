import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CLogoutPage } from "./logout/logout.page";
import { CGoogleEnteredPage } from "./google-entered/google-entered.page";
import { CLinkedinEnteredPage } from "./linkedin-entered/linkedin-entered.page";

let routes = RouterModule.forChild ([            	
	{path: "logout", component: CLogoutPage, pathMatch: "full"},	
	{path: "google-entered/:type", component: CGoogleEnteredPage},	
	{path: "linkedin-entered/:type", component: CLinkedinEnteredPage},	
	{path: "**", redirectTo: "/en/errors/404"},
]);

@NgModule({	
    imports: [	
		CommonModule,
		RouterModule,
		routes,
	],
	declarations: [
		CLogoutPage,	
		CGoogleEnteredPage,	
		CLinkedinEnteredPage,
	],    		    
})
export class CAuthModule {}