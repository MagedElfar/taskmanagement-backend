import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_task.routes";
import { Inject } from "typedi";
import TaskServices from "../services/task.services";
import TaskAttachmentServices from "../services/task_attachments.services";
import CommentServices from "../services/comment.services";
import ActivityServices from "../services/activity.services";


export default class TaskController extends Controller {
    protected routes: APIRoute[];
    private readonly taskServices: TaskServices;
    private readonly taskAttachmentServices: TaskAttachmentServices;
    private readonly commentServices: CommentServices;
    private readonly activityServices: ActivityServices

    constructor(
        path: string,
        @Inject() taskServices: TaskServices,
        @Inject() taskAttachmentServices: TaskAttachmentServices,
        @Inject() commentServices: CommentServices,
        @Inject() activityServices: ActivityServices

    ) {
        super(path);
        this.routes = routes(this);
        this.taskServices = taskServices;
        this.taskAttachmentServices = taskAttachmentServices;
        this.commentServices = commentServices;
        this.activityServices = activityServices
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

            const comments = await this.commentServices.find({
                limit: 5,
                page: 1,
                taskId: +id!
            })

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
                    comments,
                    activities
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.update(userId, +id!, req.body)

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

            await this.taskServices.updateStatus(userId, +id!, req.body.status)

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

            const userId = req.user?.id!;

            const { id } = req.params;

            await this.taskServices.updateTaskStatusWithOrder(userId, +id!, req.body.status, req.body.position)

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

            await this.taskServices.markTaskCompleat(userId, +id!)

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
    };

    async assignTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const assign = await this.taskServices.assign(userId, req.body)

            super.setResponseSuccess({
                res,
                status: 201,
                data: { assign }
            })

        } catch (error) {
            next(error)
        }
    };

    async unassignTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params

            await this.taskServices.unAssign(userId, +id)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async uploadAttachmentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const attachments = await this.taskAttachmentServices.addAttachment(userId, +req.body.taskId, req.files)

            super.setResponseSuccess({
                res,
                status: 201,
                data: {
                    attachments
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteAttachmentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params

            await this.taskAttachmentServices.deleteAtt(userId, +id)

            super.setResponseSuccess({
                res,
                status: 200
            })

        } catch (error) {
            next(error)
        }
    };
}
