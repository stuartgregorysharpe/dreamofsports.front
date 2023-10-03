import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CAccountPage } from "./page/account.page";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CComponentsModule } from "src/app/common/components/components.module";
import { CPipesModule } from "src/app/common/pipes/pipes.module";
import { CDirectivesModule } from "src/app/common/directives/directives.module";
import { CMenuAthletComponent } from "./components/menu-athlet/menu-athlet.component";
import { CMenuFirmComponent } from "./components/menu-firm/menu-firm.component";
import { CRewardsComponent } from "./components/rewards/rewards.component";
import { CMenuResumeComponent } from "./components/menu-resume/menu-resume.component";
import { CContactsComponent } from "./components/contacts/contacts.component";
import { CProfileComponent } from "./components/profile/profile.component";
import { CResumeAthletComponent } from "./components/resume/resume-athlet/resume-athlet.component";
import { CResumeFirmComponent } from "./components/resume/resume-firm/resume-firm.component";
import { CFavoritesComponent } from "./components/favorites/favorites.component";
import { CFirmsComponent } from "./components/firms/firms.component";
import { CMessengerComponent } from "./components/messenger/messenger/messenger.component";
import { CChatsComponent } from "./components/messenger/chats/chats.component";
import { CMessagesComponent } from "./components/messenger/messages/messages.component";
import { CSubscriptionComponent } from "./components/subscription/subscription/subscription.component";
import { CTariffsComponent } from "./components/subscription/tariffs/tariffs.component";
import { CPaysystemsComponent } from "./components/subscription/paysystems/paysystems.component";
import { PostComponent } from './components/post/post.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

let routes = RouterModule.forChild ([        
    {path: "", component: CAccountPage, data: {mark: "account"}}, // reuse
    // если в дальнейшем будет разница в наборах страниц между спортсменом и компанией, то можно расписать подстраницы, при надобности поставить разные гарды на отличающиеся страницы
    {path: ":subpage", component: CAccountPage, data: {mark: "account"}}, // reuse
    {path: ":subpage/:item_id", component: CAccountPage, data: {mark: "account"}}, // reuse
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        CComponentsModule,
        CPipesModule,
        CDirectivesModule,
        DropdownModule,
        DialogModule,
        routes,
    ],
    declarations: [
        CAccountPage,
        CMenuAthletComponent,
        CMenuFirmComponent,
        CResumeAthletComponent,
        CResumeFirmComponent,
        CRewardsComponent,
        CMenuResumeComponent,
        CContactsComponent,
        CProfileComponent,
        CFavoritesComponent,
        CFirmsComponent,
        CMessengerComponent,
        CChatsComponent,
        CMessagesComponent,
        CSubscriptionComponent,
        CTariffsComponent,
        CPaysystemsComponent,
        PostComponent,
    ],
    exports: [
        CAccountPage,
    ],
})
export class CAccountModule {}
