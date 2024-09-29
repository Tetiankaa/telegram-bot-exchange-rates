import {Request, Response, NextFunction} from 'express';

import {IUpdate} from "../interfaces/update.interface";
import {telegramService} from "../services/telegram.service";

export class TelegramController {

    public async getUpdates(req: Request, res: Response, next: NextFunction) {
        try {
            const update = req.body as IUpdate;

            await telegramService.getUpdates(update);
            res.sendStatus(200);
        }catch (err) {
            next(err);
        }
    }

}

export const telegramController = new TelegramController();
