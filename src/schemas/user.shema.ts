import { z } from "zod";

export const userSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().max(45).min(4),
    email: z.string().email().max(45).min(4),
    password: z.string().max(120).min(4),
    admin: z.boolean().default(false),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable()
    
});

export const userCreateSchema = userSchema.pick({
    name: true,
    email: true,
    password: true,
    admin:true
});

export const userWithoutAdmin = userSchema.omit({admin: true});
export const userUpdateSchema = userWithoutAdmin.partial();
export const userReturnSchema = userSchema.omit({password: true});

export const userReturnListSchema = userReturnSchema.array();

export const userReadSchema = userReturnSchema.array();
