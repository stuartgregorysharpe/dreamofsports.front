export interface IUserAuthData { 
    readonly id: number; 
    readonly type: TUserType; 
    readonly token: string;   
}

export type TUserType = "athlet" | "firm" | "fan";