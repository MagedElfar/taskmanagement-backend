import { TeamServices } from './../services/team.service';
import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_team.routes";
import { ITeamServices } from "../services/team.service";
import { autoInjectable, inject } from "tsyringe";

export interface ITeamController {
    getTeamHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateRoleHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeMemberHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    leaveTeamHandler(req: Request, res: Response, next: NextFunction): Promise<void>

}

@autoInjectable()
export default class TeamController extends Controller implements ITeamController {
    protected routes: APIRoute[];
    private readonly teamServices: ITeamServices



    constructor(
        @inject(TeamServices) teamServices: ITeamServices,


    ) {
        super("/teams");
        this.routes = routes(this);
        this.teamServices = teamServices;
    }

    async getTeamHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { limit = 10, page = 1, space } = req.query

            const data = await this.teamServices.find({
                space: +space!,
                limit: +limit,
                page: +page,
            });

            super.setResponseSuccess({
                res,
                status: 200,
                data: { data }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateRoleHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            await this.teamServices.update(+req.params.id, req.body.role)

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

            await this.teamServices.remove(+req.params.id)

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
