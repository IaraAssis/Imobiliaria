import { z } from 'zod';

const scheduleSchema = z.object({
    id: z.number().int().positive(),
    date: z.string(),
    hour: z.string(),
    realEstateId: z.number().int().positive(),
    userId:  z.number().int().positive()
});

export const scheduleCreateNewSchema = scheduleSchema.omit({id: true, userId: true});
export const scheduleReadSchema = scheduleSchema.array();
