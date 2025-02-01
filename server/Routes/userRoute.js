import {Router} from 'express'
import { avatarController, forgotPasswordController, loginController, logoutController, registerUserController, updateUserDetailsController, verifyEmailController } from '../controller/usercontroller.js';
import { auth } from '../Middleware/Auth.js';
import upload from '../Utils/uploadImage.js';

const userRouter = Router();

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth , logoutController)
userRouter.put('/upload-avatar',auth,  upload.single('avatar'), avatarController )
userRouter.put('/update-user-detalis', auth, updateUserDetailsController)
userRouter.put('/forgot-password', forgotPasswordController)

export default userRouter