
import { z } from "zod";
import { userCreateSchema, userReadSchema, userReturnSchema} from "../schemas/user.shema";
import { DeepPartial, Repository } from "typeorm";
import User from "../entities/user.entity";


export type UserCreate = z.infer<typeof userCreateSchema>;

export type UserRead   = z.infer<typeof userReadSchema>;
export type UserReadReturn = UserReturn[]

export type UserUpdate = DeepPartial<UserBodyUpdate>;
export type UserBodyUpdate = Omit<UserCreate, 'admin'>

export type UserReturn = z.infer<typeof userReturnSchema>
export type RepoUser = Repository<User>;
