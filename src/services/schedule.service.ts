import { RealEstate, Schedule, User } from "../entities";
import AppError from "../errors/AppError.error";
import { ScheduleCreate } from "../interfaces/shedule.interface";
import { repoRealEstate, repoSchedule, repoUser } from "../repositories";

export const createScheduleService = async (data: ScheduleCreate, userId: number): Promise<void> => {
    const newDate = new Date(data.date).getDay();
    if((newDate == 0) || (newDate == 6)) throw new AppError('Invalid date, work days are monday to friday', 400);
    const time = Number(data.hour.split(':')[0]);
    if((time < 8) || (time > 18)) throw new AppError('Invalid hour, available times are 8AM to 18PM', 400);

    const realEstate: RealEstate | null = await repoRealEstate.findOneBy({id: data.realEstateId})
    const user: User | null = await repoUser.findOneBy({ id: userId})

    await repoSchedule.save({...data, realEstate: realEstate!, user: user! })
}

export const readScheduleRealEstateService = async (id: number): Promise<RealEstate> => {
    const realEstate: RealEstate | null = await repoRealEstate.findOne({
        where: {
            id
        },
        relations: {
            schedules: {
                user: true
            },
            address: true,
            category: true
        }
    }) 
    if(!realEstate) throw new AppError('RealEstate not found',404);

    return realEstate;
}
