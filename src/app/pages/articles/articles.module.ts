import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CComponentsModule } from "src/app/common/components/components.module";
import { CPipesModule } from "src/app/common/pipes/pipes.module";
import { NgModule } from "@angular/core";
import { CDirectivesModule } from "src/app/common/directives/directives.module";
import { CArticlesPage } from "./pages/articles/articles.page";
import { CListArticles } from "./components/list-articles/list-articles.component";
import { CArticlePage } from "./pages/article/article.page";
import { CListArticleCats } from "./components/list-article-cats/list-article-cats.component";
import { CArticlesService } from "./services/articles.service";

let routes = RouterModule.forChild ([        
    {path: "", component: CArticlesPage, data: {mark: "articles"}},  // reuse
    {path: ":cat", component: CArticlesPage, data: {mark: "articles"}},  // reuse
    {path: "a/:article", component: CArticlePage},
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
        CArticlesPage,
        CArticlePage,
        CListArticles,
        CListArticleCats,
    ],
    exports: [
        CArticlesPage,
        CArticlePage,
    ],
    providers: [
        CArticlesService,
    ],
})
export class CArticlesModule {}
