import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CStaticPage } from './static.page';
import { CComponentsModule } from 'src/app/common/components/components.module';
import { CPipesModule } from 'src/app/common/pipes/pipes.module';

let routes = RouterModule.forChild ([        
    {path:"", component: CStaticPage},  
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        CComponentsModule,
        CPipesModule,
        routes,
    ],
    declarations: [CStaticPage],
    exports: [CStaticPage],
})
export class CStaticModule {}
