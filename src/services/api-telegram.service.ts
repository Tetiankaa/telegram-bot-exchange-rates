import axios from "axios";

import {config} from "../configs/config";
import {IWebhookApiRes} from "../interfaces/webhook-api-res.interface";
import {ApiResponse} from "../types/apiResponse";

const apiTelegramService = {
    setWebhook: (): ApiResponse<IWebhookApiRes> => axios.post(`${config.API_TELEGRAM}/setWebhook`,{url:`${config.PUBLIC_URL}/telegram/updates`}),
    sendMessage: (chat_id: number, text: string): ApiResponse<void> => axios.post(`${config.API_TELEGRAM}/sendMessage`, {chat_id, text}),
}

export { apiTelegramService };
