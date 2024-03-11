import { Address, Category, RealEstate } from "../entities";
import AppError from "../errors/AppError.error";
import { RealEstateCreate } from "../interfaces/realEstate.interface";
import { repoAddress, repoCategorie, repoRealEstate } from "../repositories";

export const createRealEstateService = async (data: RealEstateCreate): Promise<RealEstate> => {
    const category: Category | null = await repoCategorie.findOneBy({ id: data.categoryId});

    if(!category) throw new AppError('Category not found', 404);

    const address: Address  = await repoAddress.save(data.address);

    const realEstate: RealEstate = await repoRealEstate.save({...data, address, category: category!});

    return realEstate; 

}

export const readRealEstateService = async (): Promise<RealEstate[]> => {
    return await repoRealEstate.find({
        relations: {
            address: true
        }
    });
}