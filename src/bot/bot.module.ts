import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { YoutubeModule } from "./../youtube/youtube.module";
import { DownloadModule } from "./../download/download.module";
import { MqttModule } from "nest-mqtt-client";
import { FileManagerModule } from "./../filemanager/filemanager.module";

@Module({
    imports: [
        YoutubeModule,
        DownloadModule,
        MqttModule,
        FileManagerModule,
    ],
    providers: [BotService],
})
export class BotModule {}
