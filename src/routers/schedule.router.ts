import { Router } from "express";
import { validateBody, verifyAdmin, verifyToken } from "../middlewares/globals.middleware";
import { verifyUserScheduleExists, verifyrealEstateExists, verifyrealEstateScheduleExists } from "../middlewares/shedules.middleware";
import { createScheduleController, readScheduleRealEstateController } from "../controllers/schedule.controller";
import { scheduleCreateNewSchema } from "../schemas/shedule.shema";


export const scheduleRouter: Router = Router();

scheduleRouter.post('/',
    verifyToken, 
    validateBody(scheduleCreateNewSchema),
    verifyrealEstateExists, 
    verifyrealEstateScheduleExists, 
    verifyUserScheduleExists, 
    createScheduleController);

scheduleRouter.get('/realEstate/:id',
verifyToken, 
verifyAdmin, 
readScheduleRealEstateController);