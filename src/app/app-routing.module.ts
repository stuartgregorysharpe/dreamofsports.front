import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CErrorsModule } from './pages/errors/errors.module';
import { CStaticModule } from './pages/static/static.module';
import { CAboutModule } from './pages/about/about.module';
import { CContactsModule } from './pages/contacts/contacts.module';
import { CArticlesModule } from './pages/articles/articles.module';
import { CAccountModule } from './pages/account/account.module';
import { CAuthModule } from './pages/auth/auth.module';
import { CAuthGuard } from './common/services/guards/auth.guard';
import { CCatalogueModule } from './pages/catalogue/catalogue.module';
import { CHomePage } from './pages/home/page/home.page';
import { CPaidModule } from './pages/paid/paid.module';

const routes: Routes = [
    {path: "", component: CHomePage, data: {mark: "home"}}, // mark for reuse
    {path: "en", pathMatch: "full", redirectTo: "/"},
    {path: ":lang", component: CHomePage, data: {mark: "home"}},  // mark for reuse
    {path: ":lang/about", loadChildren: () => CAboutModule}, 
    {path: ":lang/contacts", loadChildren: () => CContactsModule}, 
    {path: ":lang/articles", loadChildren: () => CArticlesModule}, 
    {path: ":lang/catalogue", loadChildren: () => CCatalogueModule}, 
    {path: ":lang/account", loadChildren: () => CAccountModule, canActivate: [CAuthGuard]}, 
    {path: ":lang/auth", loadChildren: () => CAuthModule}, 
    {path: ":lang/errors", loadChildren: () => CErrorsModule}, 
    {path: ":lang/paid", loadChildren: () => CPaidModule}, 
    {path: ":lang/:page", loadChildren: () => CStaticModule},  
    {path: "**", redirectTo: "/en/errors/404"}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking', preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class CAppRoutingModule { }
