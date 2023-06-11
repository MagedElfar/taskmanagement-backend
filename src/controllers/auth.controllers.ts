import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express"
import routes from "../route/_auth.routes";
import authServicesFactory, { AuthServicesFactory } from "../services/auth.services";
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
    private readonly authServices: AuthServicesFactory = authServicesFactory;


    constructor() {
        super("");
    }

    async loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const user = await this.authServices.createServices().login(req.body);

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

            const { token } = req.query;

            const user = await this.authServices.createServices(token).signup({
                ...req.body,
                token: token?.toString()
            })

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

            await this.authServices.createServices().logout(req.refreshToken!);

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

            const token = await this.authServices.createServices().refreshToken(req.refreshToken!)

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