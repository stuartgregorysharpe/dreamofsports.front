import { Injectable } from "@angular/core";
import { CAppService } from "./app.service";
import { IWSMessage } from "src/app/model/dto/wsmessage.interface";
import { cfg } from "src/app/app.config";

interface ISocketListener {
    id: number;
    event: string;
    f: (v: any) => void;
}

@Injectable()
export class CSocketService {
    private socket: WebSocket = null;
    private listeners: ISocketListener[] = [];

    constructor(private appService: CAppService) {
        this.appService.isBrowser && this.connect();
    }

    public on(event: string, f: (v: any) => void): number {
        const id = this.listeners.length ? Math.max(...this.listeners.map(l => l.id)) + 1 : 1;
        this.listeners.push({id, event, f});
        return id;
    }

    public off(ids: number[]): void {
        for (let id of ids) {
            const index = this.listeners.findIndex(l => l.id === id);
            index !== -1 && this.listeners.splice(index, 1);
        }
    }

    public send(message: IWSMessage): void {
        this.socket.send(JSON.stringify(message));
    }

    ////////////////
    // utils
    ////////////////

    private async connect(): Promise<void> {
        this.socket = new WebSocket(cfg.wsUrl);
        this.socket.onopen = () => console.log("socket connected");
        this.socket.onclose = () => this.reconnect();
        this.socket.onerror = () => console.log("socket error");
        this.socket.onmessage = (message: MessageEvent) => this.processMessage(JSON.parse(message.data));
    }

    private async reconnect(): Promise<void> {
        console.log("socket reconnecting...");
        await this.appService.pause(100);
        this.connect();
    }

    private processMessage(message: IWSMessage): void {
        for (let listener of this.listeners) {
            if (message.event === listener.event) {
                listener.f(message.data);
            }
        }
    }
}