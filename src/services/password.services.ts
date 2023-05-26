import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import * as bcrypt from "bcrypt";
import UserServices from './user.services';
import TokenHelper from './jwt.services';
import EmailServices from "./email.services";


@Service()
export default class PasswordServices {
    private readonly userServices: UserServices;
    private readonly emailServices: EmailServices;
    private readonly tokenHelper: TokenHelper;


    constructor(
        @Inject() userServices: UserServices,
        @Inject() emailServices: EmailServices,
        @Inject() tokenHelper: TokenHelper,

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


            await this.userServices.update(userId, { password: newPassword });

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

            await this.emailServices.forgetPasswordMail(token, email)

            return;
        } catch (error) {
            throw error;
        }
    }

    async forgetPasswordRest(token: string, password: string) {
        try {
            const data = this.tokenHelper.verifyToken(token, 400);

            const newPassword = await bcrypt.hash(password, 10);

            await this.userServices.update(data.id, { password: newPassword });

            return;

        } catch (error) {
            throw error
        }
    }
}
