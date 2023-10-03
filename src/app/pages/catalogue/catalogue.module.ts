import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CComponentsModule } from "src/app/common/components/components.module";
import { CPipesModule } from "src/app/common/pipes/pipes.module";
import { NgModule } from "@angular/core";
import { CDirectivesModule } from "src/app/common/directives/directives.module";
import { CAthletsPage } from "./pages/athlets/athlets.page";
import { CAthletsFilterComponent } from "./components/athlets-filter/athlets-filter.component";
import { FormsModule } from "@angular/forms";
import { CSearchPage } from "./pages/search/search.page";
import { CAthletsFilteredComponent } from "./components/athlets-lists/athlets-filtered.component";
import { CAthletsSearchComponent } from "./components/athlets-lists/athlets-search.component";
import { CAthletPage } from "./pages/athlet/athlet.page";

let routes = RouterModule.forChild ([        
    {path: "", component: CAthletsPage, data: {mark: "catalogue"}},  // reuse
    {path: "search", component: CSearchPage},
    {path: ":cat", component: CAthletsPage, data: {mark: "catalogue"}},  // reuse    
    {path: "a/:id", component: CAthletPage},
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
    declarations: [
        CAthletsPage,    
        CAthletPage,
        CSearchPage,
        CAthletsFilterComponent,    
        CAthletsFilteredComponent,
        CAthletsSearchComponent,
    ],
    exports: [
        CAthletsPage,
        CAthletPage,
        CSearchPage,
    ],    
})
export class CCatalogueModule {}
