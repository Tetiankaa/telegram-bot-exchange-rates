import {Router} from "express";

import {telegramController} from "../controllers/telegram.controller";


const router = Router();

router.post('/updates', telegramController.getUpdates)

export const telegramRouter = router;
