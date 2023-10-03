import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CAppRoutingModule } from './app-routing.module';
import { CAppComponent } from './app.component';
import { CAppRouteReuseStrategy } from './app.routereusestrategy';
import { CServicesModule } from './common/services/services.module';
import { CComponentsModule } from './common/components/components.module';
import { CHomeModule } from './pages/home/home.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    FontAwesomeModule,
    CAppRoutingModule,
    CServicesModule,
    CComponentsModule,
    CHomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgbModule,
  ],
  declarations: [CAppComponent],
  providers: [
    { provide: RouteReuseStrategy, useClass: CAppRouteReuseStrategy },
  ],
  bootstrap: [CAppComponent],
})
export class CAppModule {}
