import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid-transport'

export const sendSecretMail = (adress, secret) => {
    const email = {
        from: "artiveloper@gmail.com",
        to: adress,
        subject: "Login Secret for Prismagram",
        html: `Hello! Your Login Secret is ${secret}.<br/> Copy pasete on the app/website.`
    }
    return sendEmail(email)
}

const sendEmail = (email) => {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_PASSWORD
        }
    }

    const client = nodemailer.createTransport(sendgridTransport(options))
    return client.sendMail(email)
}
