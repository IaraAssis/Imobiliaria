import { Request, Response } from "express";
import { createScheduleService, readScheduleRealEstateService } from "../services/schedule.service";


export const createScheduleController = async(req: Request, res: Response): Promise<Response> => {
    const { sub } = res.locals.decoded;
    await createScheduleService(req.body, sub);

    return res.status(201).json({message: 'Schedule created'})
}

export const readScheduleRealEstateController = async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const realEstate = await readScheduleRealEstateService(Number(id));

    return res.status(200).json(realEstate);
}