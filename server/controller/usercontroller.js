import { SendEmail } from "../Config/sendEmail.js";
import UserModel from "../models/usermodel.js";
import bcryptjs from "bcryptjs";
import { VerifyEmailTemplate } from "../Utils/VerifyEmailTemplate.js";
import { generateAccessToken } from "../Utils/generateAccessToken.js";
import generatedRefreshToken from "../Utils/generatedrefreshToken.js";


export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        messege: "provide Email , Name , Password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.json({
        messege: "Email already registered! Please login",
        success: false,
        error: true,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();
    // const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;
    // const verifyEmail = await SendEmail({
    //   email,
    //   subject: "Verify Email from Blinkit",
    //   html: VerifyEmailTemplate({
    //     name,
    //     url: verifyEmailUrl,
    //   }),
    // });

    return res.json({
      messege: "User registerd successfully",
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      messege: error.messsege || error,
      error: true,
      success: false,
    });
  }
};


export const verifyEmailController = async(req,res) =>{
  try {
    const {code} = req.body;
    const user = await UserModel.findOne({_id : code})

    if(!user){
       return res.status(400).json({
        messege:"Invalid Code, User not Verified",
        error:true
       })
    }

    const updateUser = await UserModel.updateOne({_id: code}, {verify_email: true})
    return res.json({
      messege:"User verified",
      data: updateUser 
    })

  } catch (error) {
    res.status(500).json({
      message:error.messege || error,
    error: true})
    
  }

}



export const loginController = async(req,res)=>{

  try {
    const {email , password} = req.body;

    if(!email || !password){
      return res.status(400).json({
        message: 'Provide Email, Password',
        error: true
      })
    }

    const user = await UserModel.findOne({ email })

    if(!user){
      return res.status(400).json({
        message:"User doesn't exists, Please register",
        error:true
      })
    }

    if(user.status != 'Active'){
      return res.status(400).json({
        messege:"Contact to Admin , your account is either suspended or blocked",
        error:true
      })
    }
    const checkPassword = await bcryptjs.compare(password, user.password)
    
    if(!checkPassword){
      return res.status(400).json({
        message: "Incorrect Password",
        error: true
      })
    }

    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generatedRefreshToken(user._id)
    
    const cookiesOption = {
      httpOnly: true,
      secure : true,
      SameSite : "None"
    }
    res.cookie('accessToken',accessToken,cookiesOption)
    res.cookie('refreshToken',refreshToken,cookiesOption)

    return res.json({
      message : "Login Successfully",
      success:true,
      data : {
        accessToken,
        refreshToken
      }
    })
    

    
  } catch (error) {
    return res.status(500).json({messege: error.messege || error})
  }
}



export const logoutController = async(req,res) => {
  try {
    const cookiesOption = {
      httpOnly: true,
      secure : true,
      SameSite : "None"
    }
    res.clearCookie('accessToken',cookiesOption)
    res.clearCookie('refreshToken', cookiesOption)
     

    return res.json({
      message : "Logout Successfully",
      success : true,
      error: false,
    })
    
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error : true,
      success: false
    })
    
  }
 
}
