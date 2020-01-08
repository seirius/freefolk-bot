import { Injectable, HttpStatus } from "@nestjs/common";
import { IResolveUserSearchArgs, IResolveUserSearchResponse } from "./youtube.dto";
import Axios from "axios";
import { YoutubeConfig } from "./../config/YoutubeConfig";

@Injectable()
export class YoutubeService {

    public async resolveUserSearch(args: IResolveUserSearchArgs): Promise<IResolveUserSearchResponse> {
        const {status, statusText, data} = await Axios.post(`${YoutubeConfig.HOST}/resolve-user-search`, args);
        if (status !== HttpStatus.OK) {
            throw new Error(statusText);
        }
        return data;
    }

}
