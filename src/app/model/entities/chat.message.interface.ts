export interface IChatMessage {
    readonly id: number;
    readonly chat_id: number;
    readonly user_id: number;
    readonly content: string;
    readonly created_at: string;
}