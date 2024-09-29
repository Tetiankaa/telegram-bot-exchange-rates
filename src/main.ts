import express from 'express';

import {telegramService} from "./services/telegram.service";
import {telegramRouter} from "./routers/telegram.router";

const app = express();

app.use(express.json());

telegramService.setWebhook().then();

app.use('/telegram', telegramRouter);

app.listen(4000, () => {
    console.log('Server running at http://localhost:4000');
})
