import express from 'express';

import {telegramService} from "./services/telegram.service";
import {telegramRouter} from "./routers/telegram.router";
import {config} from "./configs/config";

const app = express();

app.use(express.json());

telegramService.setWebhook().then();

app.use('/telegram', telegramRouter);

app.listen(config.PORT, () => {
    console.log(`Server running at port ${config.PORT}`);
    console.log(`Server public URL: ${config.PUBLIC_URL}`);
})
