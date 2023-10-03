import { Directive, Input, OnInit, Type, ViewContainerRef } from "@angular/core";
import { CMenuMainComponent } from "../components/menu-main/menu-main.component";
import { IKeyValue } from "src/app/model/keyvalue.interface";
import { CMenuLangsComponent } from "../components/menu-langs/menu-langs.component";

@Directive({selector: "widget-loader"})
export class CWidgetLoaderDirective implements OnInit {
    @Input() className: string;
    @Input() data: any;

    // mapping class names to components refs, so we can create component by string :-)
    private widgets: IKeyValue<Type<any>> = {
        "CMenuMainComponent": CMenuMainComponent,
        "CMenuLangsComponent": CMenuLangsComponent,
    };

    constructor(private viewContainerRef: ViewContainerRef) {}

    public ngOnInit(): void {
        const componentRef = this.viewContainerRef.createComponent(this.widgets[this.className]);
        //(<DynamicComponentRef>componentRef.instance).data = this.data;
    }
}