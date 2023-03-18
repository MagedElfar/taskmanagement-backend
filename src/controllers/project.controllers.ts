import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_project.routes";
import { Inject } from "typedi";
import ProjectServices from "../services/project.services";


export default class ProjectController extends Controller {
    protected routes: APIRoute[];
    private readonly projectServices: ProjectServices


    constructor(
        path: string,
        @Inject() projectServices: ProjectServices
    ) {
        super(path);
        this.routes = routes(this);
        this.projectServices = projectServices
    }

    async getProjectsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;
            const { limit = 10, page = 1, term = "", spaceId } = req.query

            const data = await this.projectServices.find(userId, +spaceId!, {
                limit: +limit,
                page: +page,
                term: term.toString(),
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

    async createProjectHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id!;

            const project = await this.projectServices.create(id, req.body)
            super.setResponseSuccess({
                res,
                status: 201,
                data: { project }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateProjectHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params

            const space = await this.projectServices.update(userId, +id, req.body)
            super.setResponseSuccess({
                res,
                status: 200,
                data: { space }
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteProjectHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params

            await this.projectServices.delete(userId, +id)
            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };
}
