import { Inject, Service } from "typedi";
import { IMessage, MessageRepository } from "../model/message.model";
import * as urlRegex from 'url-regex';
import linkPreviewGenerator from 'link-preview-js';
import { setError } from "../utils/error-format";

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

    async getMessages(conversation_id: number, page: number = 1) {
        try {
            return await this.messageRepository.find({ conversation_id }, { page })
        } catch (error) {
            throw error
        }
    }

    async createMessage(data: IMessage) {
        try {
            return await this.messageRepository.create(data)
        } catch (error) {
            throw error
        }
    }

    async deleteMessage(userId: number, messageId: number) {
        try {
            const message = await this.messageRepository.findOne(messageId);

            if (!message || message.sender_id !== userId) throw setError(404, "not found")

            await this.messageRepository.delete(messageId);

            return message
        } catch (error) {
            throw error
        }
    }

} 
