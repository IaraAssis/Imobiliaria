import { Router } from "express";
import { validateBody, verifyAdmin, verifyPermissions, verifyToken } from "../middlewares/globals.middleware";
import { verifyUniqueUserEmail, verifyUserExists } from "../middlewares/users.middleware";
import { userCreateSchema, userUpdateSchema } from "../schemas/user.shema";
import { createUserController, deleteUserController, readAllUserController, updateUserController } from "../controllers/user.controller";

export const userRouter: Router = Router();

userRouter.post('/', 
validateBody(userCreateSchema), 
verifyUniqueUserEmail, 
createUserController);

userRouter.get('/', 
verifyToken, 
verifyAdmin, 
readAllUserController);

userRouter.patch('/:id', 
validateBody(userUpdateSchema), 
verifyToken, 
verifyUserExists, 
verifyPermissions, 
updateUserController);

userRouter.delete('/:id', 
verifyToken, 
verifyUserExists,
verifyAdmin, 
verifyPermissions,
deleteUserController);
