import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import { IMessageReceiver, MessageReceiverRepository } from "../model/message_receivers,model";

@Service()
export default class MessagesReceiverServices {
    private readonly messageReceiverRepository: MessageReceiverRepository;

    constructor(
        @Inject() messageReceiverRepository: MessageReceiverRepository

    ) {
        this.messageReceiverRepository = messageReceiverRepository;
    }

    QueryServices() {
        return this.messageReceiverRepository.qb()
    }

    async createMany(data: Partial<IMessageReceiver>[] | IMessageReceiver[]): Promise<void> {
        try {
            await this.messageReceiverRepository.createMany(data)
        } catch (error) {
            throw error
        }
    }

} 
