import UserModel from "../models/usermodel.js";
import bcryptjs from "bcrypt"
import validator from "validator"
import sendEmail from "../Config/sendEmail.js";
import { verifyEmail } from "../Utils/verifyEmail.js";


export const registerUser = async(req, res)=>{
    const {name , email, password } = req.body
    // console.log(name , email, password);
    
    try {
       

        if(!name || !email || !password){
            return res.status(400).json({
                messege:"provide Email , Name , Password",
                error:true,
                success:false
            })
        }

        const user = await  UserModel.findOne({email})
        console.log(user);
        
        if (user){
            return res.json({
                messege:"User already exists",
                error: true,
                success:false
            })
        }
        if(!validator.isEmail(email)){
            return res.json({success:false, messege:"Please Enter a valid Email"})
        }

        else{
            const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const newUser = new UserModel({
            name,
            email,
            password:hashPassword
        })

        const save = await newUser.save()



        const emailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`
        const mail = await sendEmail({
            email,
            subject: 'Verify email from Blinkit',
            html: verifyEmail({name,url:emailUrl })

        })
        return res.json({success:true, messege:"User registered successfully", data:save})

        }

         

    } catch (error) {
        return res.status(500).json({
            messege: error.messsege || error,
            error:true,
            success:false
        })
    }
}