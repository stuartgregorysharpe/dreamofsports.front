import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { CAppModule } from './app.module';
import { CAppComponent } from './app.component';

@NgModule({
    imports: [
        CAppModule,
        ServerModule,
    ],
    bootstrap: [CAppComponent],
})
export class CAppServerModule {}
