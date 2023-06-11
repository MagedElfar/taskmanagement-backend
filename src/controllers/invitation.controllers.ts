import { existUserInvitation, InvitationServices } from '../services/Invitation.services';
import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_invitation.routes";
import { autoInjectable } from "tsyringe";

export interface IInvitationController {
    sendInvitationHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptInvitationHandler(req: Request, res: Response, next: NextFunction): Promise<void>
}

@autoInjectable()
export default class InvitationController extends Controller {
    protected routes: APIRoute[];
    private readonly invitationServices: InvitationServices


    constructor() {
        super("/invitation");
        this.routes = routes(this);
        this.invitationServices = existUserInvitation

    }

    async sendInvitationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const user = req.user;

            await this.invitationServices.sendInvitation(
                user?.username!,
                req.body.email,
                req.body.space
            )

            super.setResponseSuccess({
                res,
                status: 200,
                message: "invitation mail is sent"
            })

        } catch (error) {
            next(error)
        }
    };

    async acceptInvitationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id
            const { token } = req.query

            const member = await this.invitationServices.acceptInvitation(token?.toString()!, userId!)

            super.setResponseSuccess({
                res,
                status: 201,
                data: { member }
            })

        } catch (error) {
            next(error)
        }
    };
}
