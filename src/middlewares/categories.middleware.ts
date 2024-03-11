import { NextFunction, Request, Response } from "express";
import { Category } from "../entities";
import { repoCategorie } from "../repositories";
import AppError from "../errors/AppError.error";

export const verifyUniqueCategoryName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name } = req.body;

    const category: Category | null = await repoCategorie.findOneBy({ name });

    if(category) throw new AppError('Category already exists', 409);

    return next();
}

export const verifyCategoryExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const category: Category | null = await repoCategorie.findOneBy({id: Number(id)});

    if(!category) throw new AppError('Category not found', 404);

    return next();
    
}