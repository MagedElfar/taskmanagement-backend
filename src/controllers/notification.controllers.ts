import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_notification.routes";
import { Inject } from "typedi";
import NotificationServices from "../services/notification.services";


export default class NotificationController extends Controller {
    protected routes: APIRoute[];
    private readonly notificationServices: NotificationServices


    constructor(
        path: string,
        @Inject() notificationServices: NotificationServices
    ) {
        super(path);
        this.routes = routes(this);
        this.notificationServices = notificationServices
    }

    async getNotificationsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const receiver = + req.user?.id!

            const { limit = 10, page = 1, space_id } = req.query;

            const data = await this.notificationServices.find({
                receiver,
                limit: +limit,
                page: +page,
                space_id: +space_id!
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

    async markReadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const receiver = + req.user?.id!

            const { id } = req.params

            const data = await this.notificationServices.markASRead(receiver, +id)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async markAllReadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const receiver = + req.user?.id!

            const data = await this.notificationServices.markAllIsRead(receiver)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteNotificationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const receiver = + req.user?.id!

            const { id } = req.params

            const data = await this.notificationServices.deleteNotification(receiver, +id)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };


    async deleteAllHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const receiver = + req.user?.id!

            const data = await this.notificationServices.deleteAll(receiver)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };
}
