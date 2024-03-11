import 'dotenv/config';
import { sign } from "jsonwebtoken";
import { User } from "../entities";
import AppError from "../errors/AppError.error";
import { UserLogin, UserReturnLogin } from "../interfaces/userLogin.interface";
import { repoUser } from "../repositories";
import { compare } from 'bcryptjs';

export const loginService = async (data: UserLogin): Promise<UserReturnLogin> => {
    const { email } = data;
    const user: User | null = await repoUser.findOneBy({ email });

    if(!user) throw new AppError('Invalid credentials', 401);

    const comparePass = await compare(data.password, user.password);

    if(!comparePass) throw new AppError('Invalid credentials', 401);

    const token: string = sign(
        {email: user.email, admin: user.admin},
        process.env.SECRET_KEY!,
        {subject: user.id.toString(), expiresIn: process.env.EXPIRES_IN!}
        
    )
    return { token };
}