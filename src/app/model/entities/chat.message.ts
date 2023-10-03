import { CEntity } from "./_entity";
import { IChatMessage } from "./chat.message.interface";

export class CChatMessage extends CEntity {
    public chat_id: number;
    public user_id: number;
    public content: string;
    public created_at: Date;

    public build (o: IChatMessage): CChatMessage {
        for (let field in o) {
            if (field === "created_at") {
                this[field] = o[field] ? new Date(o[field]) : null;
            } else {
                this[field] = o[field];
            }
        }
        
        return this;
    }
}
