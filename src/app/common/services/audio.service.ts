import { Injectable } from "@angular/core";
import { CAppService } from "./app.service";

interface IAudioLib {
    [filemark: string]: HTMLAudioElement;
}

// версия с предзагрузкой всех аудиофайлов
@Injectable()
export class CAudioService {
    private filemarks: string[] = [
        "audio-message",
    ]
    private audioLib: IAudioLib = {};
    private audioUnlocker: HTMLAudioElement = null;
    private unlocked: boolean = false;
    
    constructor(private appService: CAppService) {    
        this.appService.isBrowser && this.unlock(); // for safari        
    }

    public init(): void {
        for (let filemark of this.filemarks) {            
            this.audioLib[filemark] = new Audio(`/others/${this.appService.files[filemark].fileurl}`);
        }
    }

    public alertOnMessage(): void {
        this.play("audio-message");
    }  
        
    //////////////////
    // utils
    //////////////////

    private unlock(): void {        
        this.audioUnlocker = new Audio("/assets/audio/empty.mp3");
        this.onFirstClick = this.onFirstClick.bind(this);
        window.addEventListener("click", this.onFirstClick); 
        window.addEventListener("touchstart", this.onFirstClick); 
    }

    private onFirstClick(): void {
        this.audioUnlocker.play().catch(err => console.log(err));     
        this.unlocked = true;
        window.removeEventListener("click", this.onFirstClick);
        window.removeEventListener("touchstart", this.onFirstClick);
        console.log("audio unlocked");   
    }

    private play(filemark: string): void {
        this.unlocked && this.audioLib[filemark].play().catch(err => console.log(err));        
    }
}
