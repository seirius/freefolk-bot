import * as env from "env-var";
import { config as envConfig } from "dotenv";
envConfig();

export class BotConfig {
    public static readonly KEY = env.get("BOT_KEY").required().asString();
}
