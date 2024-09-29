import axios from "axios";

import {config} from "../configs/config";
import {IRate} from "../interfaces/rate.interface";
import {ApiResponse} from "../types/apiResponse";

const exchangeRateService =  {
    getRates: (rate: string): ApiResponse<IRate> => axios.get<IRate>(`${config.API_EXCHANGE_RATE}/${rate}`),

}

export { exchangeRateService };
