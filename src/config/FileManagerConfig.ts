import * as env from "env-var";
import { config as envConfig } from "dotenv";
envConfig();

export class FileManagerConfig {
    public static readonly HOST = env.get("FILEMANAGER_HOST").required().asString();
    public static readonly PUBLIC_HOST = env.get("FILEMANAGER_PUBLIC_HOST").required().asString();
}
