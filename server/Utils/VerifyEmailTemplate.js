import React from 'react'

export const VerifyEmailTemplate = (name, url) => {
  return (
    `
        <h3>Dear ${name}</h3>
<p>Thankyou For Registering in Blinkit</p>
<a href=${url} style='color:white; border:none, padding:15px 50px; background:green; margin-top:100px'>Verify Email</a>
    `
  )
}
