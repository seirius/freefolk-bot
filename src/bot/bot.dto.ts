
import { Message, Metadata } from "node-telegram-bot-api";

export interface IOnMessagePayload {
    message: Message;
    metadata: Metadata;
}

export interface IRegisteredDownload {
    videoId: string;
    chatIds: number[];
}
