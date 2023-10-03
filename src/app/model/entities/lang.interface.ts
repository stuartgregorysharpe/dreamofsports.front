export interface ILang {
    readonly id: number;     
    readonly slug: string;    
    readonly title: string;
    readonly dir: TDir; 
    readonly dateformat: TDateFormat;
}

// [mm/dd/yyyy], [Month dd, yyyy]
// [dd.mm.yyyy], [dd month yyyy]
export type TDateFormat = "en" | "ru";

export type TDir = "ltr" | "rtl";
