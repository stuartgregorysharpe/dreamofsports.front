import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CPipesModule } from "../pipes/pipes.module";
import { CHeaderComponent } from "./header/header.component";
import { CMenuMainComponent } from "./menus/menu-main/menu-main.component";
import { CMenuLangsComponent } from "./menus/menu-langs/menu-langs.component";
import { CInputSearchComponent } from "./inputs/input-search/input-search.component";
import { CFooterComponent } from "./footer/footer.componet";
import { CMenuFootComponent } from "./menus/menu-foot/menu-foot.component";
import { CMenuMobileComponent } from "./menus/menu-mobile/menu-mobile.component";
import { CSliderArticlesComponent } from "./sliders/slider-articles/slider-articles.component";
import { CSliderArticles2Component } from "./sliders/slider-articles2/slider-articles2.component";
import { CTimePickerComponent } from "./dates/time-picker/time-picker.component";
import { CTimestampPickerComponent } from "./dates/date-pickers/timestamp-picker/timestamp-picker.component";
import { CPopupLoginComponent } from "./popups/login/popup-login.component";
import { CInputPasswordComponent } from "./inputs/input-password/input-password.component";
import { CPopupRegisterComponent } from "./popups/register/popup-register.component";
import { CInputRadioComponent } from "./inputs/input-radio/input-radio.component";
import { CPopupRecoverComponent } from "./popups/recover/popup-recover.component";
import { CDirectivesModule } from "../directives/directives.module";
import { CYearPickerComponent } from "./dates/year-picker/year-picker.component";
import { CDatePickerComponent } from "./dates/date-pickers/date-picker/date-picker.component";
import { CInputCheckboxComponent } from "./inputs/input-checkbox/input-checkbox.component";
import { CLangsRadioComponent } from "./inputs/langs-radio/langs-radio.component";
import { CTextareaComponent } from "./inputs/textarea/textarea.component";
import { CFilesComponent } from "./inputs/files/files.component";
import { CFilesItemComponent } from "./inputs/files/files-item/files-item.component";
import { CImagePickerComponent } from "./inputs/image-picker/image-picker.component";
import { CObjectableSelectComponent } from "./inputs/objectable-select/objectable-select.component";
import { CMenuFootCatsComponent } from "./menus/menu-foot-cats/menu-foot-cats.component";
import { CPopupOnlypaidComponent } from "./popups/onlypaid-warning/popup-onlypaid.component";
import { CPopupMediaViewerComponent } from "./popups/media-viewer/popup-media-viewer.component";
import { CInputSearch2Component } from "./inputs/input-search2/input-search2.component";
import { CUserMediaComponent } from "./users/user-media/user-media.component";
import { CUserOthersComponent } from "./users/user-others/user-others.component";
import { CAthletDetailsComponent } from "./users/details/athlet-details/athlet-details.component";
import { CFirmDetailsComponent } from "./users/details/firm-details/firm-details.component";
import { CAthletShortComponent } from "./users/short/athlet-short/athlet-short.component";
import { CFirmShortComponent } from "./users/short/firm-short/firm-short.component";
import { CPopupAthletComponent } from "./popups/user/athlet/popup-athlet.component";
import { CPopupFirmComponent } from "./popups/user/firm/popup-firm.component";
import { CPopupYoubannedComponent } from "./popups/youbanned-warning/popup-youbanned.component";
import { CPopupUserbannedComponent } from "./popups/userbanned-warning/popup-userbanned.component";
import { CPopupErrorComponent } from "./popups/error/popup-error.component";
import { CPopupCookiesComponent } from "./popups/cookies/popup-cookies.component";
import { CPopupComplaintComponent } from "./popups/complaint/popup-complaint.component";
import { CPopupStripeComponent } from "./popups/stripe/popup-stripe.component";
import { CAthletTinyComponent } from "./users/short/athlet-tiny/athlet-tiny.component";
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,    
        CPipesModule,    
        CDirectivesModule,
        TranslateModule,
        DropdownModule,
    ],
    declarations: [
        CHeaderComponent,
        CFooterComponent,
        CMenuMainComponent,
        CMenuLangsComponent,
        CMenuMobileComponent,
        CMenuFootComponent,
        CMenuFootCatsComponent,
        CInputSearchComponent,
        CInputSearch2Component,
        CInputPasswordComponent,
        CInputRadioComponent,
        CLangsRadioComponent,
        CTextareaComponent,
        CInputCheckboxComponent,
        CFilesComponent,
        CFilesItemComponent,
        CSliderArticlesComponent,
        CSliderArticles2Component,
        CTimePickerComponent,
        CTimestampPickerComponent,
        CDatePickerComponent,
        CYearPickerComponent,
        CObjectableSelectComponent,
        CPopupLoginComponent,
        CPopupRegisterComponent,
        CPopupRecoverComponent,
        CPopupMediaViewerComponent,
        CPopupOnlypaidComponent,
        CPopupAthletComponent,
        CPopupFirmComponent,
        CPopupYoubannedComponent,
        CPopupUserbannedComponent,
        CPopupErrorComponent,
        CPopupCookiesComponent,
        CPopupComplaintComponent,
        CPopupStripeComponent,
        CImagePickerComponent,
        CAthletShortComponent,
        CAthletTinyComponent,
        CAthletDetailsComponent,
        CFirmDetailsComponent,
        CFirmShortComponent,
        CUserMediaComponent,
        CUserOthersComponent,
    ],
    exports: [
        CHeaderComponent,
        CFooterComponent,
        CMenuMainComponent,
        CMenuLangsComponent,
        CMenuFootComponent,
        CMenuFootCatsComponent,
        CMenuMobileComponent,
        CInputSearchComponent,
        CInputSearch2Component,
        CInputPasswordComponent,
        CInputRadioComponent,
        CInputCheckboxComponent,
        CFilesComponent,
        CFilesItemComponent,
        CLangsRadioComponent,
        CTextareaComponent,
        CSliderArticlesComponent,
        CSliderArticles2Component,
        CTimePickerComponent,
        CTimestampPickerComponent,
        CDatePickerComponent,
        CYearPickerComponent,
        CObjectableSelectComponent,
        CPopupLoginComponent,
        CPopupRegisterComponent,
        CPopupRecoverComponent,
        CPopupMediaViewerComponent,
        CPopupOnlypaidComponent,
        CPopupAthletComponent,
        CPopupFirmComponent,
        CPopupYoubannedComponent,
        CPopupUserbannedComponent,
        CPopupErrorComponent,
        CPopupCookiesComponent,
        CPopupComplaintComponent,
        CPopupStripeComponent,
        CImagePickerComponent,
        CAthletShortComponent,
        CAthletTinyComponent,
        CAthletDetailsComponent,
        CFirmDetailsComponent,
        CFirmShortComponent,
        CUserMediaComponent,
        CUserOthersComponent,
        TranslateModule,
    ],      
})
export class CComponentsModule {}
