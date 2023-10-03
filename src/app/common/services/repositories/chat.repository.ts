import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IChat } from "src/app/model/entities/chat.interface";

@Injectable()
export class CChatRepository {
    constructor(private dataService: CDataService) {}

    public create(companion_id: number): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .chatsCreate(companion_id)
                .subscribe({
                    next: res => [200,201].includes(res.statusCode) ? resolve(res.data) : reject(res.statusCode),
                    error: err => reject(err.message),
                }));
    }

    public loadAll(): Promise<IChat[]> {
        return new Promise((resolve, reject) => 
            this.dataService
                .chatsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }

    public loadOne(id: number): Promise<IChat> {
        return new Promise((resolve, reject) => this.dataService
            .chatsOne(id)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode), 
                error: err => reject(err.message),
            }));
    }

    public resetUnread(id: number): Promise<void> {
        return new Promise((resolve, reject) => this.dataService
            .chatsResetUnread(id)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                error: err => reject(err.message),
            }));
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => this.dataService
            .chatsDelete(id)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                error: err => reject(err.message),
            }));
    }

    public deleteAndBan(id: number): Promise<void> {
        return new Promise((resolve, reject) => this.dataService
            .chatsDeleteAndBan(id)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                error: err => reject(err.message),
            }));
    }

    public unban(banned_id: number): Promise<void> {
        return new Promise((resolve, reject) => this.dataService
            .chatsUnban(banned_id)
            .subscribe({
                next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                error: err => reject(err.message),
            }));
    }
}