import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { CPopupComponent } from "../popup.component";

@Component({
    selector: "popup-media-viewer",
    templateUrl: "popup-media-viewer.component.html",
    styleUrls: [
        "../popup.component.scss",
        "popup-media-viewer.component.scss",
    ],
})
export class CPopupMediaViewerComponent extends CPopupComponent {
    @Input() public url: string;
    @Input() public type: "images" | "videos";
    @ViewChild("video", {static: false}) videoRef: ElementRef; 

    public onClose(): void {
        super.onClose();
        this.type === "videos" && (this.videoRef.nativeElement as HTMLVideoElement).pause();
    }
}
