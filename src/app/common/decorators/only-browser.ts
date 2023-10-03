export function OnlyBrowser() {
    return function(target: any, key: any, descriptor: any) {  
        const originalMethod = descriptor.value;  
        descriptor.value = function (...args: any[]) {  
            typeof(window) !== "undefined" && originalMethod.apply(this, args);
        };  
        
        return descriptor;
    }  
}