import { Inject, Service } from "typedi";
import { IUser } from './../model/user.model';
import { setError } from "../utils/error-format";
import UserServices from "./user.services";
import * as bcrypt from "bcrypt";
import TokenHelper from './jwt.services';
import RefreshTokenServices from "./refreshTokenList.services";
import NodeMailerServices from "./nodemailer.services";
import TeamServices from "./team.service";
import JwtServices from './jwt.services';


@Service()
export default class AuthServices {
    private readonly userService: UserServices;
    private readonly refreshTokenServices: RefreshTokenServices;
    private readonly tokenHelper: TokenHelper;
    private readonly nodemailerServices: NodeMailerServices;
    private readonly teamServices: TeamServices;
    private readonly jwtServices: JwtServices;

    constructor(
        @Inject() userService: UserServices,
        @Inject() refreshTokenServices: RefreshTokenServices,
        @Inject() tokenHelper: TokenHelper,
        @Inject() nodemailerServices: NodeMailerServices,
        @Inject() teamServices: TeamServices,
        @Inject() jwtServices: JwtServices,
    ) {
        this.userService = userService;
        this.refreshTokenServices = refreshTokenServices;
        this.tokenHelper = tokenHelper;
        this.nodemailerServices = nodemailerServices;
        this.teamServices = teamServices
        this.jwtServices = jwtServices;
    }

    async signup(data: IUser) {
        try {

            let isExist = await this.userService.isExist({ username: data.username });

            if (isExist) throw setError(409, "username already exists")

            isExist = await this.userService.isExist({ email: data.email });

            if (isExist) throw setError(409, "email already exists")

            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await this.userService.create({
                ...data,
                password: hashedPassword
            })

            const { refreshToken, accessToken } = this.tokenHelper.authTokens({ id: user.id });

            await this.refreshTokenServices.create({
                user: user.id,
                token: refreshToken
            })

            const { password, ...others } = user
            return {
                user: others,
                accessToken,
                refreshToken
            }

        } catch (error) {
            throw error
        }
    }

    async inviteSignup(data: IUser, token: string) {
        let id = 0;
        try {

            const decoded = this.jwtServices.verifyToken(token, 400);

            const email = decoded.email;

            if (!email) throw setError(400, "email is required")

            const signup = await this.signup({
                ...data,
                email
            })

            id = signup.user.id
            await this.teamServices.acceptNewUserInvitation(token, signup.user.id);

            return signup;

        } catch (error) {
            if (id > 0) await this.userService.delete(id)
            throw error
        }
    }
    async login(data: IUser) {
        try {
            const user = await this.userService.findOne({
                email: data.email
            })

            if (!user) throw setError(401, "Invalid Email Or Password");

            const isSame = await bcrypt.compare(data.password, user.password);

            if (!isSame) throw setError(401, "Invalid Email Or Password");

            const { refreshToken, accessToken } = this.tokenHelper.authTokens({ id: user.id });

            await this.refreshTokenServices.create({
                user: user.id,
                token: refreshToken
            })

            const { password, ...others } = user

            return {
                user: others,
                accessToken,
                refreshToken
            }

        } catch (error) {
            throw error;
        }
    }

    async refreshToken(token: string) {

        const oldToken = await this.refreshTokenServices.findOne({
            token
        });

        try {

            if (!oldToken) throw setError(404, "token not found");

            const data = this.tokenHelper.verifyToken(token, 401);

            const { refreshToken, accessToken } = this.tokenHelper.authTokens({ id: data.id });

            await this.refreshTokenServices.update(oldToken.id, { token: refreshToken });

            return {
                accessToken,
                refreshToken
            }
        } catch (error) {

            if (oldToken) await this.refreshTokenServices.delete(oldToken.id);

            throw error
        }
    }


    async logout(userId: number, token: string) {

        try {

            const oldToken = await this.refreshTokenServices.findOne({
                token
            });

            if (!oldToken) throw setError(404, "token not found");

            await this.refreshTokenServices.delete(oldToken.id);

            return;

        } catch (error) {

            throw error
        }
    }


    async sendForgetPasswordLink(email: string) {
        try {
            const user = await this.userService.findOne({ email });

            if (!user) throw setError(400, "user doesn't exist");

            const token = this.tokenHelper.newTokenSign({ id: user.id }, "15m");

            await this.nodemailerServices.sendForgetPasswordMail(token, email)

            return;
        } catch (error) {
            throw error;
        }
    }

    async forgetPasswordRest(token: string, password: string) {
        try {
            const data = this.tokenHelper.verifyToken(token, 400);

            const newPassword = await bcrypt.hash(password, 10);

            console.log(data.id)

            await this.userService.update(data.id, { password: newPassword });

            return;

        } catch (error) {
            throw error
        }
    }
}