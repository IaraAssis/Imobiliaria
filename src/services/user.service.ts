import { User } from "../entities";
import { UserCreate, UserReadReturn, UserReturn, UserUpdate } from "../interfaces/user.interface";
import { repoUser } from "../repositories";
import { userReturnListSchema, userReturnSchema } from "../schemas/user.shema";



export const createUserService = async (data: UserCreate): Promise<UserReturn> => {

    const user: User = repoUser.create(data); 

    await repoUser.save(user)
    return userReturnSchema.parse(user);
}

export const readAllUserService =  async (): Promise<UserReadReturn> => {

    const users: User[] = await repoUser.find();
    return userReturnListSchema.parse(users)
}

export const updateUserService = async ( data: UserUpdate, user: User): Promise<UserReturn> => {
    const userUpdate: User = repoUser.create({...user,...data})

    await repoUser.save(userUpdate);

    return userReturnSchema.parse(userUpdate);
}


export const deleteUserService = async (user: User): Promise<void> => {

    await repoUser.softRemove(user);
}