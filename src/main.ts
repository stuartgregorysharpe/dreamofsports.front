/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CAppModule } from './app/app.module';

function bootstrap() {
    platformBrowserDynamic()
        .bootstrapModule(CAppModule)
        .catch(err => console.error(err));
}

if (document.readyState === 'complete') {
    bootstrap();
} else {
    document.addEventListener('DOMContentLoaded', bootstrap);
}
