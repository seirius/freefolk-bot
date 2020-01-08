export interface IResolveUserSearchArgs {
    text: string;
    pageToken?: string;
    maxResults?: number;
}

export interface IResolveUserSearchResponse {
    videos: IVideoItem[];
    nextPageToken: string;
    totalResults: number;
}

export interface IVideoItem {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
    disabled: boolean;
    author: string;
}
