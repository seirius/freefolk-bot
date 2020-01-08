import { Module } from "@nestjs/common";
import { DefaultModule } from "./default/default.module";
import { BotModule } from "./bot/bot.module";

@Module({
    imports: [DefaultModule, BotModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
