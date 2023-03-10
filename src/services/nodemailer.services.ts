import { Service } from "typedi";
import nodemailer from "nodemailer"
import config from "../config";
import { setError } from "../utils/error-format";

@Service()
export default class NodeMailerServices {
    private mailTransporter() {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.nodemailer.user,
                pass: config.nodemailer.password,
                // clientId: config.nodemailer.clientId,
                // clientSecret: config.nodemailer.clientSecret,
                // refreshToken: config.nodemailer.refreshToken
            },
            tls: { rejectUnauthorized: false }

        })
    }

    sendForgetPasswordMail(token: string, to: string) {
        return new Promise((resolve, reject) => {
            const transporter = this.mailTransporter();

            let mailDetails = {
                from: 'admin',
                to,
                subject: 'Forget Password',
                html: `
                    <h3>Please click on the link blow to rest your password</h3>
                    <a href = ${config.clientUrl}/${token}>Rest Password</a>
                `
            };

            transporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(setError(500, "Error Occurs"))
                } else {
                    console.log('Email sent successfully');
                    resolve("email has sent")
                }
            })
        })
    }
}