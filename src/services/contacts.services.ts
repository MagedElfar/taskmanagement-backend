import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import { ContactsRepository, IContacts } from "../model/contacts.model";

@Service()
export default class ContactServices {
    private readonly contactsRepository: ContactsRepository;

    constructor(
        @Inject() contactsRepository: ContactsRepository
    ) {
        this.contactsRepository = contactsRepository;
    }

    QueryServices() {
        return this.contactsRepository.qb()
    }

    async createMany(item: Partial<IContacts>[] | IContacts[]) {
        try {

            await this.contactsRepository.createMany(item)
        } catch (error) {
            throw error
        }
    }

    async getContacts(item: Partial<IContacts>) {
        try {

            return await this.contactsRepository.find(item)
        } catch (error) {
            throw error
        }
    }
} 
