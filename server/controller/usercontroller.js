import UserModel from "../models/usermodel.js";


export const registerUserController = async(req, res)=>{
    try {
        const {name , email, password } = req.body

        if(!name || !email || !password){
            return res.status(400).json({
                messege:"provide Email , Name , Password",
                error:true,
                success:false
            })
        }

        const user = await  UserModel.findOne({email})

    } catch (error) {
        return res.status(500).json({
            messege: error.messsege || error,
            error:true,
            success:false
        })
    }
}