export interface IStartDownloadResponse {
    filename: string;
}
export enum EDownloadState {
    STAND_BY = "stand_by",
    INIT = "init",
    DOWNLOADING = "downloading",
    CONVERTING = "converting",
    END = "end",
    ERROR = "error",
    ERASED = "erased",
}

export enum EDownloadType {
    MP4 = "mp4",
    MP3 = "mp3",
}

export interface IFileState {
    id: string;
    type: EDownloadType;
    state: EDownloadState;
}
