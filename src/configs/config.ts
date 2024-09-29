import dotenv from 'dotenv'
dotenv.config();

 export const config =  {
    API_TELEGRAM: process.env.API_TELEGRAM,
    PORT: Number(process.env.PORT),
    API_EXCHANGE_RATE: process.env.API_EXCHANGE_RATE,
    PUBLIC_URL: process.env.PUBLIC_URL,
}
