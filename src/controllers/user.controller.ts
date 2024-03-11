import { Request, Response } from "express";
import { createUserService, deleteUserService, readAllUserService, updateUserService } from "../services/user.service";
import { UserReturn } from "../interfaces/user.interface";

export const createUserController = async (req: Request, res: Response): Promise<Response> => {
    const user: UserReturn = await createUserService(req.body);

    return res.status(201).json(user)
    
}

export const readAllUserController = async (req: Request, res: Response): Promise<Response> => {
    const users = await readAllUserService();

    return res.status(200).json(users)
}

export const updateUserController = async (req: Request, res: Response): Promise<Response> => {
    const { user } = res.locals;

    const newUser = await updateUserService(req.body, user);

    return res.status(200).json(newUser);
}

export const deleteUserController = async (req: Request, res: Response): Promise<Response> => {
    const { user } = res.locals;

    await deleteUserService(user);

    return res.status(204).json();
}