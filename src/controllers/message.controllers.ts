import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_message.routes";
import { Inject } from "typedi";
import MessagesServices from "../services/message.services";
import MessagesReceiverServices from "../services/message-receiver.services";


export default class MessageController extends Controller {
    protected routes: APIRoute[];
    private readonly messagesServices: MessagesServices;
    private readonly messagesReceiverServices: MessagesReceiverServices


    constructor(
        path: string,
        @Inject() messagesServices: MessagesServices,
        @Inject() messagesReceiverServices: MessagesReceiverServices
    ) {
        super(path);
        this.routes = routes(this);
        this.messagesServices = messagesServices,
            this.messagesReceiverServices = messagesReceiverServices
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

    async deleteMessageHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = + req.user?.id!
            const { id } = req.params
            const message = await this.messagesServices.deleteMessage(userId, +id!)

            res.locals.message = message;

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async markReadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const receiver_id = + req.user?.id!
            const { id } = req.params

            await this.messagesReceiverServices.markMessageRead({
                receiver_id,
                conversation_id: +id
            })

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

}
