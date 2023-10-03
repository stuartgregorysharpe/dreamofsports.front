export function Timeout(ms: number = 0) {  
    return function(target: any, key: any, descriptor: any) {  
        const originalMethod = descriptor.value;  
        descriptor.value = function (...args: any[]) {  
            setTimeout(() => originalMethod.apply(this, args), ms);  
        };  
        
        return descriptor;
    }  
}