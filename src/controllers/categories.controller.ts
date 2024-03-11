import { Request, Response } from "express";
import { createCategoryService, readAllCategoryService, readRealEstateByCategoryService } from "../services/categorie.service";

export const createCategoryController = async (req: Request, res: Response): Promise<Response> => {
    const category = await createCategoryService(req.body);

    return res.status(201).json(category);
    
}

export const readAllCategoryController = async (req: Request, res: Response): Promise<Response> => {
    const categories = await readAllCategoryService();

    return res.status(200).json(categories);
}

export const readRealEstateByCategoryController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const realEstate = await readRealEstateByCategoryService(Number(id));

    return res.status(200).json(realEstate);
}