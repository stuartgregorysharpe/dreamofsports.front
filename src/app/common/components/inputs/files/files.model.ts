export interface IFilesElement {
    url: string | File;
    name?: string;
    pos: number;
}

export type TFilesType = "images" | "videos" | "others";
