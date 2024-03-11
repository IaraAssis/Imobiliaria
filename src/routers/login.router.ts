import { Router } from "express";
import { loginController } from "../controllers/userLogin.controller";

export const loginRouter: Router = Router();

loginRouter.post('/', loginController);