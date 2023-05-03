import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_message.routes";
import { Inject } from "typedi";
import MessagesServices from "../services/message.services";


export default class MessageController extends Controller {
    protected routes: APIRoute[];
    private readonly messagesServices: MessagesServices

    constructor(
        path: string,
        @Inject() messagesServices: MessagesServices
    ) {
        super(path);
        this.routes = routes(this);
        this.messagesServices = messagesServices
    }

    async getMessagesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { page, conversation_id } = req.query

            const messages = await this.messagesServices.getMessages(+conversation_id!, +page! || 1)

            super.setResponseSuccess({
                res, status: 200,
                data: {
                    messages
                }
            })

        } catch (error) {
            next(error)
        }
    };


    async createMessageHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const sender_id = + req.user?.id!

            const message = await this.messagesServices.createMessage({
                ...req.body,
                sender_id
            })

            res.locals.message = message;

            super.setResponseSuccess({
                res,
                status: 201,
                data: { message }
            })

        } catch (error) {
            next(error)
        }
    };

    // async getConversationsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {

    //         const userId = + req.user?.id!

    //         const conversations = await this.conversationServices.getContacts(userId)

    //         super.setResponseSuccess({
    //             res,
    //             status: 200,
    //             data: { conversations }
    //         })

    //     } catch (error) {
    //         next(error)
    //     }
    // };

}
