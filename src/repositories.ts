import { AppDataSource } from './data-source';
import { Address, Category, RealEstate, Schedule, User } from './entities';
import { CategoryRepo } from './interfaces/categorie.interface';
import { AnddressRepo, RealEstateRepo } from './interfaces/realEstate.interface';
import { ScheduleRepo } from './interfaces/shedule.interface';
import { RepoUser } from './interfaces/user.interface';


export const repoUser: RepoUser = AppDataSource.getRepository(User)

export const repoRealEstate: RealEstateRepo = AppDataSource.getRepository(RealEstate);

export const repoCategorie: CategoryRepo  = AppDataSource.getRepository(Category);

export const repoSchedule: ScheduleRepo  = AppDataSource.getRepository(Schedule);

export const repoAddress:  AnddressRepo = AppDataSource.getRepository(Address);

