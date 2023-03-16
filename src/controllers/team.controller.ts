import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_team.routes";
import { Inject } from "typedi";
import TeamServices from "../services/team.service";


export default class TeamController extends Controller {
    protected routes: APIRoute[];
    private readonly teamServices: TeamServices


    constructor(
        path: string,
        @Inject() teamServices: TeamServices
    ) {
        super(path);
        this.routes = routes(this);
        this.teamServices = teamServices
    }

    async sendInvitationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const user = req.user;

            await this.teamServices.sendInvitation(
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

    async addToTeamHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { token } = req.query

            const member = await this.teamServices.acceptInvitation(token?.toString()!)

            super.setResponseSuccess({
                res,
                status: 201,
                data: { member }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateRoleHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            await this.teamServices.update(userId, +req.params.id, req.body.role)

            super.setResponseSuccess({
                res,
                status: 200,
                message: "user role is updated"
            })

        } catch (error) {
            next(error)
        }
    };

    async removeMemberHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            await this.teamServices.remove(userId, +req.params.id)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async leaveTeamHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            await this.teamServices.leave(userId, +req.params.id)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };
}