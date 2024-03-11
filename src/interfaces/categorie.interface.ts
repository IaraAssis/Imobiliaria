import { z } from "zod";
import { categorieCreateSchema, categorieReadAllSchema, categorieSchema } from "../schemas/categorie.shema";
import Category from "../entities/categories.entity";
import { Repository } from "typeorm";


export type CategoryCreate = z.infer<typeof categorieCreateSchema>;
export type CategoryReadAll  = z.infer<typeof categorieReadAllSchema>;

export type CategoryRepo = Repository<Category>;

