import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express"
import routes from "../route/_auth.routes";
import AuthServices from "../services/auth.services";
import { Inject } from "typedi";
import config from "../config";


export default class AuthController extends Controller {
    protected routes: APIRoute[] = routes(this);
    private readonly authServices: AuthServices


    constructor(path: string, @Inject() authServices: AuthServices) {
        super(path);
        this.authServices = authServices
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


            const user = await this.authServices.signup(req.body)

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

            await this.authServices.logout(req.user?.id!, req.refreshToken!);

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

    async sendForgetPasswordMailHandler(req: Request, res: Response, next: NextFunction) {
        try {

            await this.authServices.sendForgetPasswordLink(req.body.email)


            super.setResponseSuccess({
                res,
                status: 200,
                message: "email has sent"
            });

        } catch (error) {
            next(error)
        }
    }

    async forgetPasswordHandler(req: Request, res: Response, next: NextFunction) {
        try {

            await this.authServices.forgetPasswordRest(req.body.token, req.body.password)

            super.setResponseSuccess({
                res,
                status: 200,
                message: "Password rest successfully."
            });

        } catch (error) {
            next(error)
        }
    }


} 