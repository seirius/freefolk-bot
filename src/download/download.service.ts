import { Injectable, HttpStatus } from "@nestjs/common";
import { DownloadConfig } from "./../config/DownloadConfig";
import Axios from "axios";
import { IStartDownloadResponse } from "./download.dto";

@Injectable()
export class DownloadService {

    public async startDownload(id: string): Promise<IStartDownloadResponse> {
        const {data, status, statusText} = await Axios.get(`${DownloadConfig.HOST}/start-download/${id}`);
        if (status !== HttpStatus.OK) {
            throw new Error(statusText);
        }
        return data;
    }

    public async startDownloadAudio(id: string): Promise<IStartDownloadResponse> {
        const {data, status, statusText} = await Axios.get(`${DownloadConfig.HOST}/start-download/audio/${id}`);
        if (status !== HttpStatus.OK) {
            throw new Error(statusText);
        }
        return data;
    }

}
