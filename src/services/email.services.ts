import { Inject, Service } from "typedi";
import NodeMailerServices from "./nodemailer.services";


@Service()
export default class EmailServices {
    private readonly nodemailerServices: NodeMailerServices;


    constructor(@Inject() nodemailerServices: NodeMailerServices) {
        this.nodemailerServices = nodemailerServices;
    }

    async forgetPasswordMail(token: string, email: string) {
        try {

            await this.nodemailerServices.sendForgetPasswordMail(token, email)

            return;
        } catch (error) {
            throw error;
        }
    }
}
