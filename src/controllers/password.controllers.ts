import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_password.routes";
import { IPasswordServices, PasswordServices } from "../services/password.services";
import { autoInjectable, inject } from "tsyringe";

export interface IPasswordController {
    changePasswordHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendForgetPasswordMailHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgetPasswordHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@autoInjectable()
export default class PasswordController extends Controller {
    protected routes: APIRoute[];
    private readonly passwordServices: IPasswordServices;


    constructor(
        @inject(PasswordServices) passwordServices: IPasswordServices
    ) {
        super("/password");
        this.routes = routes(this);
        this.passwordServices = passwordServices
    }

    async changePasswordHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;


            await this.passwordServices.changePassword(+id!, req.body)

            super.setResponseSuccess({ res, status: 200, message: "user password updated successfully" })

        } catch (error) {
            next(error)
        }
    };


    async sendForgetPasswordMailHandler(req: Request, res: Response, next: NextFunction) {
        try {

            await this.passwordServices.sendForgetPasswordLink(req.body.email)


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

            await this.passwordServices.forgetPasswordRest(req.body.token, req.body.password)

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
