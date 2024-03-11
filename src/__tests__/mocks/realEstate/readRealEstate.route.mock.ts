import { DeepPartial, Repository } from 'typeorm';
import { AppDataSource } from '../../../data-source';
import { Address, RealEstate } from '../../../entities';

type iRealEstateRepo = Repository<RealEstate>;
type iAddressRepo = Repository<Address>;

const manyRealStations = async (
  realEstateTotal: number = 5
): Promise<Array<DeepPartial<RealEstate>>> => {
  const realEstateRepo: iRealEstateRepo =
    AppDataSource.getRepository(RealEstate);
  const addressRepo: iAddressRepo = AppDataSource.getRepository(Address);

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
    });
  }

  await realEstateRepo
    .createQueryBuilder('rs')
    .insert()
    .values(manyRealEstate)
    .execute();

  return manyRealEstate;
};

export default { manyRealStations };
