import { z } from 'zod';
import { realEstateCreateSchema} from '../schemas/realEstate.shema';
import { Repository } from 'typeorm';
import RealEstate from '../entities/realEstates.entity';
import { Address } from '../entities';


export type RealEstateCreate = z.infer<typeof realEstateCreateSchema>;

export type RealEstateRepo = Repository<RealEstate>;

export type AnddressRepo = Repository<Address>;

