import { Router } from "express";
import { userRouter } from "./user.router";
import { loginRouter } from "./login.router";
import { realEstateRouter } from "./realEstate.router";
import { scheduleRouter } from "./schedule.router";
import { categoriesRouter } from "./categorie.router";

export const routes: Router = Router();

routes.use('/users', userRouter);
routes.use('/login',loginRouter);
routes.use('/realEstate',realEstateRouter);
routes.use('/schedules',scheduleRouter);
routes.use('/categories',categoriesRouter);
