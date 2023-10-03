export interface IResponse<T> {
    readonly statusCode: number;
    readonly error?: string;
    readonly data?: T;
    readonly elementsQuantity?: number; // quantity of all elements in table
    readonly pagesQuantity?: number; // quantity of pages in pagination  
    readonly sum?: number;
}
