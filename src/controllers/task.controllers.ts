import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_task.routes";
import { Inject } from "typedi";
import TaskServices from "../services/task.services";
import TaskAttachmentServices from "../services/task_attachments.services";
import ActivityServices from "../services/activity.services";


export default class TaskController extends Controller {
    protected routes: APIRoute[];
    private readonly taskServices: TaskServices;
    private readonly taskAttachmentServices: TaskAttachmentServices;
    private readonly activityServices: ActivityServices;

    constructor(
        path: string,
        @Inject() taskServices: TaskServices,
        @Inject() taskAttachmentServices: TaskAttachmentServices,
        @Inject() activityServices: ActivityServices,

    ) {
        super(path);
        this.routes = routes(this);
        this.taskServices = taskServices;
        this.taskAttachmentServices = taskAttachmentServices;
        this.activityServices = activityServices;
    }

    async getTasksHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;


            const tasks = await this.taskServices.find({
                ...req.query,
                userId
            });

            super.setResponseSuccess({
                res,
                status: 200,
                data: { tasks }
            })

        } catch (error) {
            next(error)
        }
    };

    async createHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            let task;

            if (req.body?.parentId) {
                task = await this.taskServices.createSubTask(userId, req.body)
            } else {
                task = await this.taskServices.create(userId, req.body)
            }

            res.locals.task = task;

            super.setResponseSuccess({
                res,
                status: 201,
                data: { task }
            })

        } catch (error) {
            next(error)
        }
    };

    async getTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.findOne(userId, +id!);

            const subTasks = await this.taskServices.find({ parentId: +id! });

            const attachments = await this.taskAttachmentServices.find(task.id)

            const activities = await this.activityServices._find(+id, {
                limit: 5,
                page: 1
            })


            super.setResponseSuccess({
                res,
                status: 200,
                data: {
                    task,
                    attachments,
                    subTasks,
                    activities
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id } = req.params;

            const task = await this.taskServices.update(+id!, req.body)

            res.locals.task = task;

            super.setResponseSuccess({
                res,
                status: 200,
                data: { task }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateTaskStatusHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            await this.taskServices.updateStatus(+id!, req.body.status)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async updateTaskOrderHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id } = req.params;

            const task = await this.taskServices.updateTaskStatusWithOrder(+id!, req.body.status, req.body.position)

            console.log("resp")

            res.locals.task = task

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async markTaskCompleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.markTaskCompleat(+id!)

            res.locals.task = task;

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async archiveTaskCompleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.archiveTask(+id!)

            res.locals.task = task
            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id } = req.params;

            const task = await this.taskServices.delete(+id!)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    }
}
