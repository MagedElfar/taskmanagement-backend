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
}
