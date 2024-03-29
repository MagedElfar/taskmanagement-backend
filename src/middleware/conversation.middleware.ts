import Container from "typedi";
import ContactServices from "../services/contacts.services";
import { Request, Response, NextFunction } from "express";
import { setError } from "../utils/error-format";
import ConversationServices from "../services/conversation.services";
import { IMessage } from "../model/message.model";
import { IMessageReceiver } from "../model/message_receivers.model";
import MessagesReceiverServices from "../services/message-receiver.services";
import SocketServices from "../services/Socket.services";

export default class ConversationMiddlerWare {

    private static readonly contactServices: ContactServices = Container.get(ContactServices);
    private static readonly conversationServices: ConversationServices = Container.get(ConversationServices)
    private static readonly messagesReceiverServices: MessagesReceiverServices = Container.get(MessagesReceiverServices)


    static isAllowed = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            let conversation_id;

            console.log(req.method)

            if (req.method === "GET") {
                conversation_id = req.query.conversation_id
            } else {
                conversation_id = req.body.conversation_id
            }

            const isAllowedContact = await ConversationMiddlerWare.contactServices.isAllowedContact(userId!, conversation_id)

            if (!isAllowedContact) throw setError(404, "conversation not found")

            next()

        } catch (error) {
            next(error)
        }
    };

    static updateMassageReceivers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    const message: IMessage = res.locals.message;

                    const { contacts } = await ConversationMiddlerWare.conversationServices.getContacts({
                        user_Id: userId,
                        conversation_id: message.conversation_id
                    })

                    SocketServices.emitMassage(message)

                    const receivers: Partial<IMessageReceiver>[] = SocketServices.emitUnreadMassage(
                        message,
                        contacts
                    )

                    await ConversationMiddlerWare.messagesReceiverServices.createMany(receivers)
                    resolve()
                });

                next();
            });

        } catch (error) {
            next(error)
        }
    };

    static createConversation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    const contact = res.locals.contact;
                    const user = res.locals.userId

                    SocketServices.emitNewConnection(contact, user)


                    resolve()
                });

                next();
            });

        } catch (error) {
            next(error)
        }
    };

    static deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    const message: IMessage = res.locals.message;


                    SocketServices.emitDeleteMassage(message)

                });

                next();
            });

        } catch (error) {
            next(error)
        }
    };

}