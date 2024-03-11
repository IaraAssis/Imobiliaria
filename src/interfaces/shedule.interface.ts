import { z } from 'zod';
import { Repository } from 'typeorm';
import Schedule from '../entities/schedules.entity';
import { scheduleCreateNewSchema, scheduleReadSchema } from '../schemas/shedule.shema';

export type ScheduleCreate = z.infer<typeof scheduleCreateNewSchema>;
export type ScheduleRead   = z.infer<typeof scheduleReadSchema>;

export type ScheduleRepo = Repository<Schedule>;