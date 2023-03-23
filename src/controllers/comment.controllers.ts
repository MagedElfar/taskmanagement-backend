import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_comment.routes";
import { Inject } from "typedi";
import CommentServices from "../services/comment.services";


export default class CommentController extends Controller {
    protected routes: APIRoute[];
    private readonly commentServices: CommentServices


    constructor(
        path: string,
        @Inject() commentServices: CommentServices
    ) {
        super(path);
        this.routes = routes(this);
        this.commentServices = commentServices
    }

    async getCommentsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const { limit = 10, page = 1, term = "", taskId = 0 } = req.query;

            const data = await this.commentServices.find({
                taskId: +taskId,
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

            const comment = await this.commentServices.addComment(user?.id!, req.body);

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

            await this.commentServices.deleteComment(user?.id!, +id);

            super.setResponseSuccess({
                res,
                status: 200
            })

        } catch (error) {
            next(error)
        }
    };
}
