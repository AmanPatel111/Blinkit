import { SendEmail } from "../Config/sendEmail.js";
import UserModel from "../models/usermodel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { VerifyEmailTemplate } from "../Utils/VerifyEmailTemplate.js";
import { generateAccessToken } from "../Utils/generateAccessToken.js";
import generatedRefreshToken from "../Utils/generatedrefreshToken.js";
import { cloudinaryUploader } from "../Utils/cloudinaryUploader.js";
import { forgotPasswordTemplate } from "../Utils/forgotPasswordTemplate.js";

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
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;
    const verifyEmail = await SendEmail({
      email,
      subject: "Verify Email from Blinkit",
      html: VerifyEmailTemplate(
        name,
        verifyEmailUrl
      ),
    });

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

export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        messege: "Invalid Code, User not Verified",
        error: true,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      { verify_email: true }
    );
    return res.json({
      messege: "User verified",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.messege || error,
      error: true,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Provide Email, Password",
        error: true,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User doesn't exists, Please register",
        error: true,
      });
    }

    if (user.status != "Active") {
      return res.status(400).json({
        messege:
          "Contact to Admin , your account is either suspended or blocked",
        error: true,
      });
    }
    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Incorrect Password",
        error: true,
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);
    const updatetoken = await UserModel.updateOne(
      { email: email },
      { $set: { refresh_token: refreshToken } }
    );

    const cookiesOption = {
      // httpOnly: false,
      // secure : true,
      // SameSite : "None"
    };
    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "Login Successfully",
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        messege: "Error occured in login controller",
        success: false,
        error: error.messege || error,
      });
  }
};

// Logout Controller
export const logoutController = async (req, res) => {
  try {
    const userId = req.userId;
    const cookiesOption = {
      // httpOnly: true,
      // secure : true,
      // SameSite : "None"
    };
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removetoken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    return res.json({
      message: "Logout Successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Avatar Controller
export const avatarController = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.userId;

    if (!file) {
      return res.json({
        success: false,
        message: "File not uploaded",
      });
    }
    const upload = await cloudinaryUploader(file);
    if (!upload || !upload.secure_url) {
      return res.json({
        success: false,
        message: "Failed to get the image URL from Cloudinary",
      });
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: upload?.secure_url },
      { new: true }
    );

    return res.json({
      success: true,
      message: "File uploaded to database",
      data: updateUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured while uploading avatar" });
  }
};

// Update User Details Controller
export const updateUserDetailsController = async (req, res) => {
  try {
    const userId = req.userId; //coming from Auth Middleware
    const { name, email, mobile, password } = req.body;
    let hashPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }
    const updateFields = {
      ...(name && { name }),
      ...(email && { email }),
      ...(mobile && { mobile }),
      ...(password && { password: hashPassword }),
    };

    const updateUser = await UserModel.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    return res.json({
      success: true,
      message: "User Details updated Successfully",
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

//Forgot Password Controller

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email doesn't exists",
      });
    }

    const otp = Math.floor(Math.random() * 900000) + 100000;
    const expiry = new Date(new Date().getTime() + 5 * 60 * 1000);  //validate for 5 mins 
    
   
    const update = await UserModel.findByIdAndUpdate(
      user._id,
      {
        forgot_password_otp: otp,
        forgot_password_expiry: new Date(expiry).toISOString(),
      },
      { new: true }
    );

    await SendEmail({
      email,
      subject:"Forgot Password OTP from Blinkit",
      html:forgotPasswordTemplate(user.name, otp)
    })

    return res.json({
      message:"OTP sent Successfully",
      success:true
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

// Verify Forgot Password OTP
export const verifyForgotPasswordOtpController = async(req,res)=>{
try {
  const {email , OTP} = req.body  

  if(!email || !OTP){
    return res.status(400).json({
      message:"Enter Email & OTP",
      success:false,
    })
  }

  const user = await UserModel.findOne({email})

  if(!user){
    return res.json({
      message:"User not found , kindly register",
      success: false
    })
  }
  
  if (OTP !== user.forgot_password_otp){
    return res.status(400).json({
      message:"Incorrect OTP !",
      success: false
    })
  }

  if (user.forgot_password_expiry < new Date()){
    return res.json({
      message:"OTP Expeired !",
      success: false
    })
  }

  
  // return res.json({
  //   message:"User Verified",
  //   success:true
  // })


} catch (error) {
  return res.status(500).json({
    message: error.message || error,
    success:false
  })
}
}

//Reset Password 
export const resetPasswordController  = async(req,res)=>{
  try {
    const {  email, newPassword, confirmPassword}= req.body;

    if(!email || !newPassword || !confirmPassword) {
      return res.json({
        message:"Please Provide Email & New Password & Confirm Password",
        success: false
      })
    }

    if (newPassword !== confirmPassword){
      return res.json({
        message:"New password & Confirm Password should be same",
        success: false
      })
    }

    const user = await UserModel.findOne({email})
    
    if(!user){
      return res.json({
        message:"User not found",
        success: false
      })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(newPassword, salt)

    user.password = hashPassword;
    user.forgot_password_otp = null;
    user.forgot_password_expiry = null;
    await user.save();

    return res.json({
      message:' Password changed Successfully!',
      success: true
    })
    
  } catch (error) {
    return res.json({
      message: error.message || error,
      success: false
    })
  }
}

// Refresh Token Controller
export const refreshTokenController  = async(req,res)=>{
try {
  const refreshToken = req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1];

  if(!refreshToken){
    return res.status(401).json({
      message:"Unauthorised Access/ Refresh token not found",
      success: false
    })
  }

  const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

  if (!verifyToken){
    return res.status(401).json({
      message:"Token Expired !",
      success: false
    })
  }
  const userId = verifyToken.id
  const accessToken = await generateAccessToken(userId)
  const cookiesOption = {
httpOnly : true,
secure: true,
sameSite: "none"
  }
  res.cookie('accessToken',accessToken, cookiesOption)
  return res.json({
    message:" Access token updated ",
    success: true,
    data: {
      accessToken : accessToken
    }
  })

} catch (error) {
  
}
}