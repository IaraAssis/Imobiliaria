import { Router } from "express";
import { validateBody, verifyAdmin, verifyToken } from "../middlewares/globals.middleware";
import { verifyAddressExists } from "../middlewares/realEstates.middleware";
import { createRealEstateController, readAllRealEstateController } from "../controllers/realEstate.controller";
import { realEstateCreateSchema } from "../schemas/realEstate.shema";

export const realEstateRouter: Router = Router();

realEstateRouter.post('/',
verifyToken, verifyAdmin, 
validateBody(realEstateCreateSchema), 
verifyAddressExists, 
createRealEstateController );

realEstateRouter.get('/', readAllRealEstateController);