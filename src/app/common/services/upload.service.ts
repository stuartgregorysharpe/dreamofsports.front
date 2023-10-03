import { Injectable } from "@angular/core";
import { cfg } from "src/app/app.config";
import { IHTMLInputEvent } from "src/app/model/htmlinputevent.interface";

export type TUploadType = "image" | "video" | "other" | "any";

@Injectable()
export class CUploadService {
    public selectFiles(multiple: boolean, type: TUploadType): Promise<File | File[]> {
        return new Promise((resolve, reject) => {            
            const element = this.buildElement(multiple, type);
            element.onchange = async (event: IHTMLInputEvent) => {   
                const filter = this.buildFilter(type);
                const selectedFiles = Array.from(event.target.files).filter(filter);

                if (selectedFiles.length !== event.target.files.length) {
                    reject("one of file is too big or unsupported");
                    return;
                } 

                const data = multiple ? selectedFiles : selectedFiles[0];
                element.remove();
                resolve(data);
            }
            document.body.appendChild(element);
            element.click();
        });
    }

    ///////////////
    // utils
    ///////////////

    private buildElement(multiple: boolean, type: TUploadType): HTMLElement {
        const element = document.createElement("input");
        element.style.display = "none";
        element.type = "file";
        if (type === "image") element.accept = cfg.allowedImageTypes.toString();
        if (type === "video") element.accept = cfg.allowedVideoTypes.toString();
        if (type === "other") element.accept = cfg.allowedOtherTypes.toString();
        if (multiple) element.setAttribute("multiple", "multiple");
        return element;
    }

    private buildFilter(type: TUploadType): (f: File) => boolean {
        if (type === "image") return f => f.size <= cfg.maxImageFileSize && cfg.allowedImageTypes.includes(f.type);
        if (type === "video") return f => f.size <= cfg.maxVideoFileSize && cfg.allowedVideoTypes.includes(f.type);
        if (type === "other") return f => f.size <= cfg.maxOtherFileSize && cfg.allowedOtherTypes.includes(f.type);
        return f => f.size <= cfg.maxAnyFileSize;
    }
}
