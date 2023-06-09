import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express"
import routes from "../route/_auth.routes";
import AuthServices, { InviteAuthServices, LocalAuthServices } from "../services/auth.services";
import config from "../config";
import { autoInjectable } from "tsyringe";

export interface IAuthController {
    loginHandler(req: Request, res: Response, next: NextFunction): void;
    signupHandler(req: Request, res: Response, next: NextFunction): void;
    logoutHandler(req: Request, res: Response, next: NextFunction): void;
    refreshTokenHandler(req: Request, res: Response, next: NextFunction): void;
}

@autoInjectable()
export default class AuthController extends Controller implements IAuthController {

    protected routes: APIRoute[] = routes(this);
    private readonly authServices: AuthServices;
    private readonly inviteAuthServices: AuthServices


    constructor(
        authServices: LocalAuthServices,
        inviteAuthServices: InviteAuthServices
    ) {
        super("");
        this.authServices = authServices;
        this.inviteAuthServices = inviteAuthServices
    }

    async loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const user = await this.authServices.login(req.body);

            res.cookie("refresh_token", user.refreshToken, config.cookie.option)

            super.setResponseSuccess({
                res,
                status: 200,
                data: user
            });

        } catch (error) {
            next(error)
        }
    };

    async signupHandler(req: Request, res: Response, next: NextFunction) {
        try {

            const { token } = req.query


            let user;

            if (token) {
                user = await this.inviteAuthServices.signup({
                    ...req.body,
                    token: token?.toString()
                })
            } else {
                user = await this.authServices.signup(req.body)
            }

            res.cookie("refresh_token", user.refreshToken, config.cookie.option)

            super.setResponseSuccess({
                res,
                status: 201,
                message: "user are created",
                data: user
            });

        } catch (error) {
            next(error)
        }
    }

    async logoutHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            await this.authServices.logout(req.refreshToken!);

            super.setResponseSuccess({
                res,
                status: 200,
            });

        } catch (error) {
            next(error)
        }
    };

    async refreshTokenHandler(req: Request, res: Response, next: NextFunction) {
        try {

            const token = await this.authServices.refreshToken(req.refreshToken!)

            res.cookie("refresh_token", token.refreshToken, config.cookie.option)

            super.setResponseSuccess({
                res,
                status: 200,
                data: token
            });

        } catch (error) {
            next(error)
        }
    }
} 