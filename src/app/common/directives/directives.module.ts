import { NgModule } from "@angular/core";
import { CAppearAnimationDirective } from "./appear-animation.directive";
import { CTrimDirective } from "./trim.directive";
import { NgModel } from "@angular/forms";
import { CSortableDirective } from "./sortable.directive";
import { CSmartMediaDirective } from "./smart-media.directive";

@NgModule({
    declarations: [     
        CAppearAnimationDirective,
        CTrimDirective,
        CSortableDirective,
        CSmartMediaDirective,
    ],
    exports: [   
        CAppearAnimationDirective,
        CTrimDirective,
        CSortableDirective,
        CSmartMediaDirective,
    ],    
    providers: [
        NgModel,
    ],
})
export class CDirectivesModule {}
