import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_password.routes";
import { Inject } from "typedi";
import PasswordServices from "../services/password.services";

export default class PasswordController extends Controller {
    protected routes: APIRoute[];
    private readonly passwordServices: PasswordServices;


    constructor(
        path: string,
        @Inject() passwordServices: PasswordServices
    ) {
        super(path);
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
