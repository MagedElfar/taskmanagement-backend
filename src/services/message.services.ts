import { Inject, Service } from "typedi";
import { IMessage, MessageRepository } from "../model/message.model";

@Service()
export default class MessagesServices {
    private readonly messageRepository: MessageRepository;

    constructor(
        @Inject() messageRepository: MessageRepository

    ) {
        this.messageRepository = messageRepository;
    }

    QueryServices() {
        return this.messageRepository.qb()
    }

    async createMessage(data: IMessage) {
        try {
            return await this.messageRepository.create(data)
        } catch (error) {
            throw error
        }
    }

} 
