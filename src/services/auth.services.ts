import { InvitationServices, newUserInvitation } from './Invitation.services';
import { setError } from "../utils/error-format";
import userService, { IUserServices } from "./user.services";
import * as bcrypt from "bcrypt";
import jwtServices, { IJwtServices } from './jwt.services';
import refreshTokenServices, { IRefreshTokenServices } from "./refreshTokenList.services";
import { LoginDto, SignupDto } from "../dto/auth.dto";
import { autoInjectable, container, inject } from "tsyringe";

export abstract class AuthServices {
    protected readonly userService: IUserServices;
    protected readonly refreshTokenServices: IRefreshTokenServices;
    protected readonly tokenHelper: IJwtServices;

    constructor(
        userService: IUserServices,
        refreshTokenServices: IRefreshTokenServices,
        tokenHelper: IJwtServices,
    ) {
        this.userService = userService;
        this.refreshTokenServices = refreshTokenServices;
        this.tokenHelper = tokenHelper;
    }

    async signup(signupDto: SignupDto) {
        try {

            const { token, ...signupData } = signupDto

            let isExist = await this.userService.isExist({ username: signupDto.username });

            if (isExist) throw setError(409, "username already exists")

            isExist = await this.userService.isExist({ email: signupDto.email });

            if (isExist) throw setError(409, "email already exists")

            const hashedPassword = await bcrypt.hash(signupDto.password, 10);

            const user = await this.userService.create({
                ...signupData,
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

    async login(loginDto: LoginDto) {
        try {
            const user = await this.userService.findOne({
                email: loginDto.email
            })

            if (!user) throw setError(401, "Invalid Email Or Password");

            const isSame = await bcrypt.compare(loginDto.password, user.password);

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


    async logout(token: string) {

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
}

@autoInjectable()
export class InviteAuthServices extends AuthServices {
    protected readonly invitationServices: InvitationServices;

    constructor() {
        super(
            userService,
            refreshTokenServices,
            jwtServices
        )

        this.invitationServices = newUserInvitation
    }

    async signup(signupDto: SignupDto) {

        const { token, ...user } = signupDto

        let id = 0;
        try {

            const decoded = this.tokenHelper.verifyToken(token!, 400);

            const email = decoded.email;

            if (!email) throw setError(400, "email is required")

            const userData = await super.signup({
                ...user,
                email
            })

            id = userData.user.id
            await this.invitationServices.acceptInvitation(token!, userData.user.id);

            return userData;

        } catch (error) {
            if (id > 0) await this.userService.delete(id)
            throw error
        }
    }
}

@autoInjectable()
export class LocalAuthServices extends AuthServices {
    constructor() {
        super(
            userService,
            refreshTokenServices,
            jwtServices,
        )
    }
}


const inviteAuthServices = container.resolve(InviteAuthServices);
const localAuthServices = container.resolve(LocalAuthServices);

export class AuthServicesFactory {
    constructor() { }

    createServices(token?: any): AuthServices {
        if (token) return inviteAuthServices

        return localAuthServices
    }
}

export default new AuthServicesFactory()