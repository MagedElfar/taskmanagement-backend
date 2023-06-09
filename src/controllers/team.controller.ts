import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_team.routes";
import { Inject } from "typedi";
import { ITeamServices } from "../services/team.service";
import SpaceServices from "../services/space.services";
import ProjectServices from "../services/project.services";


export default class TeamController extends Controller {
    protected routes: APIRoute[];
    private readonly teamServices: ITeamServices
    private readonly spaceService: SpaceServices;
    private readonly projectService: ProjectServices


    constructor(
        path: string,
        @Inject() teamServices: ITeamServices,
        @Inject() spaceService: SpaceServices,
        @Inject() projectService: ProjectServices

    ) {
        super(path);
        this.routes = routes(this);
        this.teamServices = teamServices;
        this.spaceService = spaceService;
        this.projectService = projectService
    }

    async getTeamHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { limit = 10, page = 1, space } = req.query

            const data = await this.teamServices.find({ space: +space! }, {
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

            const userId = req.user?.id
            const { token } = req.query

            const member = await this.teamServices.acceptInvitation(token?.toString()!, userId!)

            const space = await this.spaceService.findOne(member.space);

            const { team } = await this.teamServices.find({ space: member.space }, {})

            const { projects } = await this.projectService._find(space.id)

            super.setResponseSuccess({
                res,
                status: 201,
                data: {
                    member,
                    space,
                    team,
                    projects
                }
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
