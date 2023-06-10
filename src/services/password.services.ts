import { setError } from '../utils/error-format';
import * as bcrypt from "bcrypt";
import { IUserServices } from './user.services';
import { IJwtServices } from './jwt.services';
import { IEmailServices, NodeMailerServices } from "./email.services";
import { autoInjectable, container, inject } from "tsyringe";

export interface IPasswordServices {
    changePassword(userId: number, data: { password: string, new_password: string }): Promise<void>;
    sendForgetPasswordLink(email: string): Promise<void>;
    forgetPasswordRest(token: string, password: string): Promise<void>
}

@autoInjectable()
export class PasswordServices implements IPasswordServices {
    private readonly userServices: IUserServices;
    private readonly emailServices: IEmailServices;
    private readonly tokenHelper: IJwtServices;


    constructor(
        @inject("IUserServices") userServices: IUserServices,
        @inject(NodeMailerServices) emailServices: IEmailServices,
        @inject("IJwtServices") tokenHelper: IJwtServices,

    ) {
        this.userServices = userServices;
        this.emailServices = emailServices;
        this.tokenHelper = tokenHelper;

    }

    async changePassword(userId: number, data: {
        password: string,
        new_password: string
    }) {
        try {

            const user = await this.userServices.findUser({ id: userId });

            const isSame = await bcrypt.compare(data.password, user.password);

            if (!isSame) throw setError(400, "Invalid Password");

            const newPassword = await bcrypt.hash(data.new_password, 10);


            await this.userServices.update({
                userId,
                password: newPassword
            });

            return;

        } catch (error) {
            throw error
        }
    }

    async sendForgetPasswordLink(email: string) {
        try {
            const user = await this.userServices.findOne({ email });

            if (!user) throw setError(400, "user doesn't exist");

            const token = this.tokenHelper.newTokenSign({ id: user.id }, "15m");

            await this.emailServices.sendForgetPasswordMail(email, token)

            return;
        } catch (error) {
            throw error;
        }
    }

    async forgetPasswordRest(token: string, password: string) {
        try {
            const data = this.tokenHelper.verifyToken(token, 400);

            const newPassword = await bcrypt.hash(password, 10);

            await this.userServices.update({
                userId: data.id,
                password: newPassword
            });

            return;

        } catch (error) {
            throw error
        }
    }
}

container.register("IPasswordServices", { useClass: PasswordServices })