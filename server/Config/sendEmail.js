import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

if(!process.env.RESEND_API){
    console.log("Please provide RESEND API secret key in .env")
}

const resend = new Resend(process.env.RESEND_API);

export const SendEmail = async({email, subject, html}) =>{

    try { 
        const { data, error } = await resend.emails.send({
            from: "Blinkit <onboarding@resend.dev>",
            to: email,
            subject: subject,
            html: html,
          });
         
          if (error) {
            return { error }
          }
          return data
        
    } catch (error) {
        console.log(error);
        
    }
}

