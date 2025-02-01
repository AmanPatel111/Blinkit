export const forgotPasswordTemplate = (name,OTP) => {
  return `
  <div>
  <p>Dear ${name},</p>
  <br/>
<p>You have requested a password reset .<br/> Please use the following OTP code to reset password is : ${OTP} . <br/>Please don't share it with anyone.</p>
<p>This is valid for only one hour.</p>
<br/>
<p>Thanks</p>
<p>Blinkit</p>
  <div>
  `
}