import { Injectable, Logger } from "@nestjs/common";
import TelegramBot from "node-telegram-bot-api";
import { BotConfig } from "./../config/BotConfig";
import { IOnMessagePayload, IRegisteredDownload } from "./bot.dto";
import { Observable } from "rxjs";
import { YoutubeService } from "./../youtube/youtube.service";
import { DownloadService } from "./../download/download.service";
import { MqttService } from "nest-mqtt-client";
import { IFileState, EDownloadState } from "./../download/download.dto";
import { FileManagerService } from "./../filemanager/filemanager.service";

@Injectable()
export class BotService {

    private readonly logger = new Logger(BotService.constructor.name);

    public readonly bot: TelegramBot;
    private readonly onMessageObservable: Observable<IOnMessagePayload>;

    private readonly registeredDownloads: IRegisteredDownload[] = [];

    constructor(
        private readonly youtubeService: YoutubeService,
        private readonly downloadService: DownloadService,
        private readonly mqttService: MqttService,
        private readonly fileManagerService: FileManagerService,
    ) {
        this.bot = new TelegramBot(BotConfig.KEY, {polling: true});
        this.bot.on("error", (error) => this.logger.error(error));
        this.onMessageObservable = this.subscribeToMessage();

        this.onMessage().subscribe(async ({
            message: {
                chat: {id},
                text,
            },
            metadata,
        }) => {
            try {
                const {videos: [video]} = await this.youtubeService.resolveUserSearch({text, maxResults: 1});
                if (video) {
                    this.bot.sendMessage(id, `Video title: *${video.title}* (${video.duration}) [thumbnail](${video.thumbnailUrl})`, {
                        parse_mode: "Markdown",
                        reply_markup: {
                            inline_keyboard: [[
                                {
                                    text: "Audio",
                                    callback_data: `download:audio:${video.id}`,
                                },
                                {
                                    text: "Video",
                                    callback_data: `download:video:${video.id}`,
                                },
                            ]],
                        },
                    });
                } else {
                    this.bot.sendMessage(id, "No results were found");
                }
            } catch (error) {
                this.logger.error(error);
                this.bot.sendMessage(id, "An unexpected error ocurred, try again later.");
            }
        });

        this.bot.on("callback_query", async ({
            data,
            message: {
                chat: {id},
            },
        }) => {
            try {
                const [callbackType, type, videoId] = data.split(":");
                if (callbackType === "download") {
                    if (type === "audio") {} else if (type === "video") {
                        await this.downloadService.startDownload(videoId);
                        this.registerDownload(videoId, id);
                    }
                    this.bot.sendMessage(id, "Your download started");
                }
            } catch (error) {
                this.logger.error(error);
                this.bot.sendMessage(id, "An unexpected error ocurred, try again later.");
            }
        });

        this.mqttService.sub({
            channel: "file_state",
            callback: (payload: IFileState) => {
                // do nothing
            },
        });

        this.mqttService.sub({
            channel: "progress",
            callback: async (payload: IFileState) => {
                if (payload.state === EDownloadState.END) {
                    const registeredDownload = this.retrieveRegisteredDownloads(payload.id);
                    if (registeredDownload && registeredDownload.chatIds.length) {
                        const data = await this.fileManagerService.download(payload.id);
                        const buffer: any = Buffer.from(data, "utf8");
                        buffer.filename = "test.mp4";
                        registeredDownload.chatIds.forEach((id) => {
                            (this.bot.sendVideo as any)(id, Buffer.from(data, "utf8"), {}, {
                                filename: "test.mp4",
                                contentType: "video/mp4",
                            });
                        });
                    }
                }
            },
        });
    }

    public onMessage(): Observable<IOnMessagePayload> {
        return this.onMessageObservable;
    }

    private subscribeToMessage(): Observable<IOnMessagePayload> {
        return new Observable(subscriber => {
            this.bot.on("message", (message, metadata) => subscriber.next({message, metadata}));
        });
    }

    private registerDownload(videoId: string, chatId: number): void {
        let registeredDownload = this.registeredDownloads.find(({videoId: vidId}) => vidId === videoId);
        if (!registeredDownload) {
            registeredDownload = {
                videoId,
                chatIds: [],
            };
            this.registeredDownloads.push(registeredDownload);
        }
        registeredDownload.chatIds.push(chatId);
    }

    private retrieveRegisteredDownloads(videoId: string, erase = true): IRegisteredDownload {
        const index = this.registeredDownloads.findIndex(({videoId: vidId}) => vidId === videoId);
        if (index > -1) {
            const registeredDownload = this.registeredDownloads[index];
            if (erase) {
                this.registeredDownloads.splice(index, 1);
            }
            return registeredDownload;
        }
    }
}
