import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_activity.routes";
import { Inject } from "typedi";
import ActivityServices from "../services/activity.services";


export default class ActivityController extends Controller {
    protected routes: APIRoute[];
    private readonly activityServices: ActivityServices


    constructor(
        path: string,
        @Inject() activityServices: ActivityServices
    ) {
        super(path);
        this.routes = routes(this);
        this.activityServices = activityServices
    }

    async getActivitiesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const { limit = 10, page = 1, taskId = 0 } = req.query;

            const userId = req.user?.id!;

            const data = await this.activityServices.find(userId, +taskId, {
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

    async addCommentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const user = req.user;

            const comment = await this.activityServices.addComment(user?.id!, req.body);

            super.setResponseSuccess({
                res,
                status: 201,
                data: { comment }
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteCommentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const user = req.user;

            const { id } = req.params

            await this.activityServices.deleteComment(user?.id!, +id);

            super.setResponseSuccess({
                res,
                status: 200
            })

        } catch (error) {
            next(error)
        }
    };

    async editCommentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const user = req.user;

            const { id } = req.params

            await this.activityServices.editComment(user?.id!, +id, req.body);

            super.setResponseSuccess({
                res,
                status: 200
            })

        } catch (error) {
            next(error)
        }
    };

}
