import { NgModule } from "@angular/core";
import { CSafePipe } from "./safe.pipe";

@NgModule({
    declarations: [ 
        CSafePipe,
    ],
    exports: [
        CSafePipe,
    ]
})
export class CPipesModule {}
