import {ActivatedRouteSnapshot, BaseRouteReuseStrategy} from '@angular/router';

export class CAppRouteReuseStrategy extends BaseRouteReuseStrategy {
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {        
        // default angular behavior
        if (future.routeConfig === curr.routeConfig) 
            return true;
        
        // my addon for reuse marked components
        if (            
            future.routeConfig.data && 
            future.routeConfig.data["mark"] &&             
            curr.routeConfig.data && 
            curr.routeConfig.data["mark"] &&             
            future.routeConfig.data["mark"] === curr.routeConfig.data["mark"]) {            
            return true;
        }            

        return false;
    }
}