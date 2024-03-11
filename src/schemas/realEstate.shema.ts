import { z } from 'zod';

export const realEstateSchema = z.object({
    id: z.number().int().positive(),
    value: z.union([z.number(), z.string()]).transform((val) => (typeof val === "number" ? val : parseFloat(val))).default(0),
    size: z.number().int().positive(),
    address: z.object({
        street: z.string().max(45),
        zipCode: z.string().max(8),
        number: z.number().int().positive(),
        city: z.string().max(20),
        state: z.string().max(2),
    }),
    categoryId: z.number().int().positive(),
    sold: z.boolean().default(false),
    
});

export const realEstateCreateSchema = realEstateSchema.omit({id: true});
export const realEstateReadSchema = realEstateSchema.array();
