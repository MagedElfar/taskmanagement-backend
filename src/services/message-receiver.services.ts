import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import { IMessageReceiver, MessageReceiverRepository } from "../model/message_receivers.model";

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


    async markMessageRead(data: Partial<IMessageReceiver>) {
        try {
            await this.messageReceiverRepository.updateMany(data, { is_read: true })
        } catch (error) {
            throw error
        }
    }

    async unreadCount(receiver_id: number) {
        try {
            return await this.messageReceiverRepository.find({
                receiver_id,
                is_read: false
            })
        } catch (error) {
            throw error
        }
    }

} 
