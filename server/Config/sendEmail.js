import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    console.log("Enter RESEND API KEY in .ENV")
}
const resend = new Resend(process.env.RESEND_API);
const sendEmail = async ({ email , subject , html})=>{
  
  
try {
    const { data, error } = await resend.emails.send({
        from: 'Blinkit <onboarding@resend.dev>',
        to: email,
        subject: subject,
        html: html,
      });

      if (error) {
        return console.error({ error });
      }
      
      return data
      
      
    
} catch (error) {
    console.error(error)
}
}

export default sendEmail
