import * as env from "env-var";
import { config as envConfig } from "dotenv";
envConfig();

export class YoutubeConfig {
    public static readonly HOST = env.get("YOUTUBE_HOST").required().asString();
}
