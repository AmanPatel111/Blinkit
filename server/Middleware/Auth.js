export const auth = (req,res,next) =>{

    try {
        const token = req?.cookies?.accessToken || req?.header?.authorization?.split("")[1]   // [ "Bearer" , "token"]
        console.log("token", token)
        // if (!token) {
        //     return res.status(401).json({ message: 'No token, authorization denied' });
        //   }
        //   try {
        //     const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        //     req.user = decoded;
        //     next();
        //   } catch (err) {
        //     res.status(401).json({ message: 'Token is not valid' });
            
        //   }
        next();
    } catch (error) {
        res.status(500).json({
            message : error.message | error,
            success: false,
            error: true
        })
    }
}