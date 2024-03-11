import { z } from "zod";

export const categorieSchema = z.object({
    id: z.number().positive(),
    name: z.string().max(45)
})

export const categorieCreateSchema = categorieSchema.omit({id: true});
export const categorieReadAllSchema = categorieSchema.array();
