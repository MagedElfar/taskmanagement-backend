import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_conversation.routes";
import { Inject } from "typedi";
import ConversationServices from "../services/conversation.services";


export default class ConversationController extends Controller {
    protected routes: APIRoute[];
    private readonly conversationServices: ConversationServices


    constructor(
        path: string,
        @Inject() conversationServices: ConversationServices
    ) {
        super(path);
        this.routes = routes(this);
        this.conversationServices = conversationServices
    }

    async createConversationHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = + req.user?.id!

            const conversation = await this.conversationServices.createConversation(userId, req.body.userId)

            super.setResponseSuccess({
                res,
                status: 201,
                data: { conversation }
            })

        } catch (error) {
            next(error)
        }
    };

    async getConversationsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = + req.user?.id!

            const conversations = await this.conversationServices.getContacts({ user_Id: userId })

            super.setResponseSuccess({
                res,
                status: 200,
                data: { conversations }
            })

        } catch (error) {
            next(error)
        }
    };

}
