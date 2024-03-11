import { Category } from "../entities";
import AppError from "../errors/AppError.error";
import { CategoryCreate, CategoryReadAll } from "../interfaces/categorie.interface";
import { repoCategorie } from "../repositories";

export const createCategoryService = async (data: CategoryCreate): Promise<Category> => {
    return repoCategorie.save(data);
}

export const readAllCategoryService =  async (): Promise<CategoryReadAll> => {
    return await repoCategorie.find()

}

export const readRealEstateByCategoryService =  async (id: number): Promise<Category> => {
    const category: Category | null = await repoCategorie.findOne({
        where: {
            id,
        },
        relations: {
            realEstate: true
        }
    })
    
    if(!category) throw new AppError('Category not found', 404) 

    return category;
}