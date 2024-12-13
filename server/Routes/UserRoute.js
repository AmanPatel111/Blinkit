import {Router} from 'express'
import { loginController, logoutController, registerUserController, verifyEmailController } from '../controller/usercontroller.js';
import { auth } from '../Middleware/Auth.js';

const userRouter = Router();

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth , logoutController)

export default userRouter