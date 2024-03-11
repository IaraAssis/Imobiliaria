import { Repository } from 'typeorm';
import { AppDataSource } from '../../../data-source';
import { Address, Category, RealEstate } from '../../../entities';

type iCategoryRepo = Repository<Category>;
type iRealEstateRepo = Repository<RealEstate>;
type iAddressRepo = Repository<Address>;

const categoryRealStation = async (): Promise<any> => {
  const categoryRepo: iCategoryRepo = AppDataSource.getRepository(Category);
  const category = await categoryRepo.save({ name: 'Studio' });

  const realEstateRepo: iRealEstateRepo =
    AppDataSource.getRepository(RealEstate);
  const addressRepo: iAddressRepo = AppDataSource.getRepository(Address);

  const realEstateTotal: number = 5;

  const manyAddresses = Array.from(Array(realEstateTotal)).map((val, index) => {
    return {
      city: `city${index}`,
      street: `street${index}`,
      state: `s${index}`,
      zipCode: `zipCode${index}`,
      number: index,
    };
  });

  const manyRealEstate = [];

  for await (const address of manyAddresses) {
    const realEstateVal = Math.random() * 10000000;
    const addressCreate = await addressRepo.save(address);
    manyRealEstate.push({
      value: parseFloat(realEstateVal.toString()).toFixed(2),
      size: Math.ceil(Math.random() * 100),
      address: addressCreate,
      category: { id: category.id },
    });
  }

  await realEstateRepo
    .createQueryBuilder('rs')
    .insert()
    .values(manyRealEstate)
    .execute();

  return {
    ...category,
    realEstate: await realEstateRepo.find(),
  };
};

export default { categoryRealStation };
