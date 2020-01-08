import * as env from "env-var";
import { config as envConfig } from "dotenv";
envConfig();

export class DownloadConfig {
    public static readonly HOST = env.get("DOWNLOAD_HOST").required().asString();
}
