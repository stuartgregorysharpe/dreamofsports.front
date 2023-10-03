export class CChunk<T> {
    constructor(
        public data: T[] = [],
        public elementsQuantity: number = 0,
        public pagesQuantity: number = 0,
    ) {}    
}