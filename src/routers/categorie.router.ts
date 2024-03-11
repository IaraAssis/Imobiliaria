import { Router } from "express";
import { validateBody, verifyAdmin, verifyToken } from "../middlewares/globals.middleware";
import { verifyCategoryExists, verifyUniqueCategoryName } from "../middlewares/categories.middleware";
import { createCategoryController, readAllCategoryController, readRealEstateByCategoryController } from "../controllers/categories.controller";
import { categorieCreateSchema } from "../schemas/categorie.shema";

export const categoriesRouter: Router = Router();

categoriesRouter.post('/',
validateBody(categorieCreateSchema), 
verifyToken, 
verifyUniqueCategoryName, 
verifyAdmin, 
createCategoryController);
categoriesRouter.get('/', 
readAllCategoryController);
categoriesRouter.get('/:id/realEstate', 
verifyCategoryExists, 
readRealEstateByCategoryController);
