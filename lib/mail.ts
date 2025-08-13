import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationToken = async (
    email: string,
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/newverification?token=${token}`;

    const sent = await resend.emails.send({
        from: "user@kshitijbhardwaj.in",
        to: email,
        subject: "Confirm Your email",
        html: `<p>Click <a href="${confirmLink}"> here </a> to confirm your email </p>`
    })

    console.log(sent);
}

export const sendResetPasswordToken = async (
    email: string,
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/newpassword?token=${token}`;

    const sent = await resend.emails.send({
        from: "user@kshitijbhardwaj.in",
        to: email,
        subject: "Confirm Your email",
        html: `<p>Click <a href="${confirmLink}"> here </a> to reset your password </p>`
    })

    if(sent){
        return true
    }else{
       return false;
    }

    
}

export const sendTwoFactorToken = async (
    email: string,
    token: string
) => {
   

    const sent = await resend.emails.send({
        from: "user@kshitijbhardwaj.in",
        to: email,
        subject: "Confirm Your email",
        html: `<p>Your 2fa code is ${token}</p>`
    })

    if(sent){
        return true
    }else{
       return false;
    }

    
}

