import { userSchema } from "./user.shema";


export const userLoginSchema = userSchema.pick({
    email: true,
    password: true
});

