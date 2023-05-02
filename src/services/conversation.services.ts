import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import { ConversationsRepository } from '../model/conversations.model';
import ContactServices from "./contacts.services";
import UserServices from "./user.services";
import { IContacts } from "../model/contacts.model";

@Service()
export default class ConversationServices {
    private readonly conversationRepository: ConversationsRepository;
    private readonly contactServices: ContactServices;
    private readonly userServices: UserServices

    constructor(
        @Inject() conversationRepository: ConversationsRepository,
        @Inject() contactServices: ContactServices,
        @Inject() userServices: UserServices
    ) {
        this.conversationRepository = conversationRepository;
        this.contactServices = contactServices;
        this.userServices = userServices
    }

    QueryServices() {
        return this.conversationRepository.qb()
    }

    async createConversation(user1: number, user2: number) {
        try {

            if (user1 === user2) throw setError(400, "users should be different")

            const user = await this.userServices.findUser({ id: user2 });

            if (!user) throw setError(400, "user is not found")

            let conversion = await this.conversationRepository.checkIfExist(user1, user2)

            if (conversion) throw setError(409, "this conversation is already exist")

            conversion = await this.conversationRepository.create({});

            const contacts = [
                {
                    conversation_id: conversion.id,
                    user_Id: user1
                },
                {
                    conversation_id: conversion.id,
                    user_Id: user2
                }
            ]

            await this.contactServices.createMany(contacts)

            return conversion

        } catch (error) {
            throw error
        }
    }


    async getContacts(data: IContacts | Partial<IContacts>) {
        try {
            return await this.contactServices.getContacts(data)
        } catch (error) {
            throw error
        }
    }
} 
