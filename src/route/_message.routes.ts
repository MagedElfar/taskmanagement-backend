import Controller, { APIRoute, Methods } from '../app/controller';
import ConversationMiddlerWare from '../middleware/conversation.middleware';
import validation from "../middleware/validation.middleware"
import { createMessageSchema, getMassagesSchema } from '../utils/_message-validation-schema';

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getMessagesHandler,
            localMiddleware: [
                validation(getMassagesSchema, "query"),
                ConversationMiddlerWare.isAllowed,
            ],
            auth: true
        },
        {
            path: "/",
            method: Methods.POST,
            handler: controller.createMessageHandler,
            localMiddleware: [
                validation(createMessageSchema),
                ConversationMiddlerWare.isAllowed,
                ConversationMiddlerWare.updateMassageReceivers
            ],
            auth: true
        }
    ]
    return r;
}


export default routes