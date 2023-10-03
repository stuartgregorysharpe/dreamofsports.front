export class CMessage {
    constructor(
        public name: string = "",
        public email: string = "",
        public content: string = "",
    ) {}

    public trim(): void {
        for (let field in this) {
            this[field] = (this[field] as any).trim();
        }
    }
}
