import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CComponentsModule } from "src/app/common/components/components.module";
import { CHomePage } from "./page/home.page";
import { CPipesModule } from "src/app/common/pipes/pipes.module";
import { CDirectivesModule } from "src/app/common/directives/directives.module";
import { CAthletsTopComponent } from "./components/athlets-top/athlets-top.component";
import { CPostList } from "./components/post-list/post-list.component";

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CNewPost } from "./components/new-post/new-post.component";
import { CPost } from "./components/post/post.component";
import { FormsModule } from "@angular/forms";
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { CarouselModule } from 'primeng/carousel';
import { ClipboardModule } from 'ngx-clipboard';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({	
    imports: [	
		CommonModule,
		RouterModule,
		CComponentsModule,
		FormsModule,
		CPipesModule,
		ToastModule,
		TooltipModule,
		MenuModule,
		CarouselModule,
		CDirectivesModule,
		DialogModule,
		ButtonModule,
		ClipboardModule,
		ConfirmDialogModule,
	],
	declarations: [
		CHomePage,
		CAthletsTopComponent,
		CPostList,
		CNewPost,
		CPost
	],   
	exports: [
		CHomePage,
	],	    
})
export class CHomeModule {}