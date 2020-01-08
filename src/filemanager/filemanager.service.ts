import { Injectable } from "@nestjs/common";
import { WriteStream } from "fs";
import Axios from "axios";
import { FileManagerConfig } from "./../config/FileManagerConfig";

@Injectable()
export class FileManagerService {

    public async download(id: string): Promise<string> {
        return (await Axios.get(`${FileManagerConfig.HOST}/download/${id}`, {
            responseType: "blob",
        })).data;
    }

}
