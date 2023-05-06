import { IContacts } from './../model/contacts.model';
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

            console.log(conversation)

            const contact = conversation.find((contact: IContacts) => contact.user_Id !== userId);



            res.locals.contact = conversation.find((contact: IContacts) => contact.user_Id === userId);

            res.locals.userId = req.body.userId



            super.setResponseSuccess({
                res,
                status: 201,
                data: { contact }
            })

        } catch (error) {
            next(error)
        }
    };

    async getConversationsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = + req.user?.id!

            const { contacts, unreadCount } = await this.conversationServices.getContacts({ user_Id: userId })

            super.setResponseSuccess({
                res,
                status: 200,
                data: {
                    conversations: contacts,
                    unreadCount
                }
            })

        } catch (error) {
            next(error)
        }
    };

}
