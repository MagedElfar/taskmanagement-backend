import nodemailer from "nodemailer"
import { container } from "tsyringe";
import config from "../config";
import { setError } from "../utils/error-format";

export interface IEmailServices {
    sendForgetPasswordMail(email: string, token: string): Promise<any>
    sendJoinTeamInvitation(token: string, from: string, space: string, to: string, redirectUrl: string): Promise<any>
}

export class NodeMailerServices implements IEmailServices {
    private mailTransporter() {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.google.user,
                pass: config.google.password,
            },
            tls: { rejectUnauthorized: false }

        })
    }

    sendForgetPasswordMail(email: string, token: string) {
        return new Promise((resolve, reject) => {
            const transporter = this.mailTransporter();

            let mailDetails = {
                from: 'no-replay@gmail.com',
                to: email,
                subject: 'Forget Password',
                html: `
                    <h3>Please click on the link blow to rest your password</h3>
                    <a href = ${config.clientUrl}/forgot-password?token=${token}>Rest Password</a>
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

    sendJoinTeamInvitation(token: string, from: string, space: string, to: string, redirectUrl: string) {
        return new Promise((resolve, reject) => {
            const transporter = this.mailTransporter();

            let mailDetails = {
                from: 'admin',
                to,
                subject: 'Space join Invitation',
                html: `
                    <h3>${from} invite you to join ${space} workspace</h3>
                    <a href = ${config.clientUrl}/${redirectUrl}?token=${token}>Join Now</a>
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

container.register("IEmailServices", { useClass: NodeMailerServices })

const emailServices = container.resolve(NodeMailerServices);

export default emailServices
