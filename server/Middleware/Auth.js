import jwt from "jsonwebtoken"

export const auth = (req,res,next) =>{

    try {
        const token = req?.cookies || req?.header?.authorization?.split("")[1]   
       
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
          }
          try {
            const decoded = jwt.verify(token?.accessToken , process.env.SECRET_KEY_ACCESS_TOKEN);
        if(!decoded){
            return res.status(401).json({
                message : "unauthorized  access"
            })
        }
            req.userId = decoded.id;
            next();
          } catch (err) {
            res.status(401).json({ message: 'Token is not valid' });
            
          }
        
    } catch (error) {
        res.status(500).json({
            message : error.message | error,
            success: false,
            error: true
        })
    }
}