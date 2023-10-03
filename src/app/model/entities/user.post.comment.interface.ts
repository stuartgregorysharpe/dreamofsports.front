import { IUser } from "./user.interface";

export class IUserPostComment {
    readonly user_id: number;
    readonly content: string;
    readonly created_at: Date;
    readonly user: IUser;
}

export class IusePostLike {
    readonly user_id: number;
    readonly post_id: number;
}